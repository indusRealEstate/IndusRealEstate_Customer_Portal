import { Location, formatDate } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { DocUploadDialogRegister } from "app/components/dialog/dialog";
import { AuthenticationService } from "app/services/authentication.service";
import { ChatService } from "app/services/chat.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "user-chats",
  templateUrl: "./user_chats.html",
  styleUrls: ["./user_chats.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserChatsComponent implements OnInit {
  isUserSignedIn: boolean = false;

  userId: any;
  user: any;

  sending_msg: any = "";

  search_chats: any = "";

  search_clients: any = "";

  chats: any[] = [0, 1, 0, 1];

  temp_chats: any[] = [];

  allClients: any[] = [];

  allClients_temp: any[] = [];

  chats_loading: boolean = false;

  currentChat_usr: any;

  sidebarChatOpened: boolean = false;

  is_user_typing: boolean = false;

  isAllClientsLoading: boolean = false;

  sending_new_message: boolean = false;

  ngDoCheckInitialize: boolean = false;

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";
  chatImgsPath: any = "https://indusre.app/api/upload/chat/";

  chatroom_msgs: any[] = [];

  all_chats: any[] = [];

  unread_chats: any[] = [];

  socket_dups: any[] = [];

  uploadedFiles: any[] = [];

  constructor(
    private chatService: ChatService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices,
    private http: HttpClient,
    private _location: Location,
    private dialog?: MatDialog
  ) {
    this.sidebarChatOpened = true;
    this.isAllClientsLoading = true;
    this.chats_loading = true;
    this.getScreenSize();
    
    authenticationService.validateToken().subscribe((res) => {
      if (res != "not-expired") {
        authenticationService.logout();
      }
    });
  }

  urlInit(url, user_id) {
    if (url.uid != user_id) {
      this.router.navigate(["/404"]);
    }

    this.chatService.allClients.subscribe((all_cl) => {
      this.allClients = all_cl;

      if (url.chat_uid != undefined) {
        all_cl.forEach((v) => {
          if (url.chat_uid == v.user_id) {
            this.currentChat_usr = v;
            // console.log("url init");
            setTimeout(() => {
              this.newChatOpen(v, true);
            }, 1000);
          }
        });
      }
    });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  @ViewChild("msg_bar") private currentChatScroll: ElementRef;

  scrollToBottom(): void {
    if (this.currentChatScroll != undefined) {
      try {
        this.currentChatScroll.nativeElement.scrollTop =
          this.currentChatScroll.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  currentUserTyping() {
    var usr = JSON.stringify({
      user_id: this.userId,
      send_to_id: this.currentChat_usr.user_id,
    });
    this.chatService.userTyping(usr);
  }

  deleteMessage(msg, i) {
    this.chatService
      .deleteChatMessage({ message_id: msg.message_id })
      .subscribe((v) => {
        // console.log(v);
      });

    if (msg.file == 1) {
      this.chatService
        .deleteFileFromServer({ file_name: msg.file_path })
        .subscribe((e) => {});
    }

    if (msg.image == 1) {
      this.chatService
        .deleteFileFromServer({ file_name: msg.image_path })
        .subscribe((e) => {});
    }

    this.chatService.deleteMessage(
      JSON.stringify({ msg_id: msg.message_id, send_to_id: msg.send_to_id })
    );
    this.chatroom_msgs.splice(i, 1);

    for (let index = 0; index < this.all_chats.length; index++) {
      if (msg.message_id == this.all_chats[index].message_id) {
        this.all_chats.splice(index, 1);
      }
    }
  }

  attachFile() {
    this.dialog
      .open(DocUploadDialogRegister, {
        width: "700px",
        height: "450px",
        data: { upload: "chat_file_upload" },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          this.sendFileMsg(res.data, false);
        } else {
        }
      });
  }

  attachImage() {
    this.dialog
      .open(DocUploadDialogRegister, {
        width: "700px",
        height: "450px",
        data: { upload: "chat_file_upload", image_only: true },
      })
      .afterClosed()
      .subscribe(async (res) => {
        if (res != undefined) {
          await this.sendFileMsg(res.data, true);
        } else {
        }
      });
  }

  getFileSize(file) {
    var size = JSON.parse(file)["size"];
    return this.otherServices.formatBytes(size);
  }

  serachChats(type) {
    if (type == "chats") {
      if (this.search_chats != "") {
        var searchText = new String(this.search_chats).trim().toLowerCase();

        this.chats = this.temp_chats.filter((v) =>
          new String(v.firstname).trim().toLowerCase().includes(searchText)
        );
      } else {
        this.chats = this.temp_chats;
      }
    } else if (type == "clients") {
      if (this.search_clients != "") {
        var searchText = new String(this.search_clients).trim().toLowerCase();

        this.allClients = this.allClients_temp.filter((v) =>
          new String(v.firstname).trim().toLowerCase().includes(searchText)
        );
      } else {
        this.allClients = this.allClients_temp;
      }
    }
  }

  initFunction() {
    this.chatService.newRecievedMessage
      .subscribe((v) => {
        if (v != 0) {
          // console.log(v);
          var dupData = this.all_chats.filter(
            (all_ch) => all_ch.message_id == v.message_id
          );
          if (dupData.length == 0) {
            this.all_chats.push(v);
            var sended_user = this.chats.filter((c) => c.user_id == v.user_id);
            if (
              this.currentChat_usr != undefined &&
              this.currentChat_usr.user_id == v.user_id
            ) {
              this.chatroom_msgs.push(v);
              if (this.chats.length != 0) {
                var c_i = this.chats.indexOf(sended_user[0]);
                Object.assign(this.chats[c_i], { new_msg: true });
              }
            } else {
              if (sended_user.length != 0) {
                var c_i = this.chats.indexOf(sended_user[0]);
                Object.assign(this.chats[c_i], { new_msg: true });
              } else {
                var sended_user_al_ch = this.allClients.filter(
                  (c) => c.user_id == v.user_id
                );
                console.log(sended_user_al_ch[0]);
                Object.assign(sended_user_al_ch[0], { new_msg: true });
                this.chats.push(sended_user_al_ch[0]);
              }
            }

            // if (sended_user.length != 0) {
            var i = this.chats.indexOf(sended_user[0]);
            this.otherServices.array_move(this.chats, i, 0);
            // }
          }
        }
      })
      .add(() => {
        this.scrollToBottom();
      });

    this.chatService.deletedMessage.subscribe((v) => {
      if (v != 0) {
        if (this.currentChat_usr != undefined) {
          // console.log(v);
          var d = this.chatroom_msgs.filter((m) => m.message_id == v.msg_id)[0];
          var i = this.chatroom_msgs.indexOf(d);
          this.chatroom_msgs.splice(i, 1);
        }

        var al_d = this.all_chats.filter((c) => c.message_id == v.msg_id)[0];
        var al_i = this.all_chats.indexOf(al_d);
        this.all_chats.splice(al_i, 1);
      }
    });

    this.chatService.new_joined_users.subscribe((n_j_u: any[]) => {
      n_j_u.forEach((j) => {
        this.allClients.forEach((u) => {
          if (j.user_id == u.user_id) {
            Object.assign(u, { online: true });
          }
        });

        this.chats.forEach((c) => {
          if (j.user_id == c.user_id) {
            Object.assign(c, { online: true });
          }
        });

        if (this.currentChat_usr != undefined) {
          if (this.currentChat_usr.online == undefined) {
            if (j.user_id == this.currentChat_usr.user_id) {
              Object.assign(this.currentChat_usr, { online: true });
            }
          }
        }
      });
    });

    this.chatService.leaved_user.subscribe((l_u) => {
      this.allClients.forEach((u, i) => {
        if (l_u.user_id == u.user_id) {
          delete this.allClients[i].online;
        }
      });

      this.chats.forEach((c, i) => {
        if (l_u.user_id == c.user_id) {
          delete this.chats[i].online;
        }
      });

      if (this.currentChat_usr != undefined) {
        if (this.currentChat_usr.online != undefined) {
          if (l_u.user_id == this.currentChat_usr.user_id) {
            delete this.currentChat_usr.online;
          }
        }
      }
    });

    this.chatService.typingUser.subscribe((t_u) => {
      if (this.currentChat_usr != undefined) {
        if (this.currentChat_usr.user_id == t_u.user_id) {
          this.is_user_typing = true;
        }
      }
    });

    this.chatService.notTypingUser.subscribe((n_t_u) => {
      if (this.currentChat_usr != undefined) {
        if (this.currentChat_usr.user_id == n_t_u.user_id) {
          this.is_user_typing = false;
        }
      }
    });
  }

  ngDoCheck() {
    if (this.currentChat_usr != undefined) {
      if (this.sending_msg == "") {
        var usr = JSON.stringify({
          user_id: this.userId,
          send_to_id: this.currentChat_usr.user_id,
        });
        this.chatService.userNotTyping(usr);
      }
    }

    if (this.ngDoCheckInitialize == true) {
      if (this.chats.length != 0) {
        var dup = [];
        this.chats.forEach((c, i) => {
          if (!dup.includes(c.user_id)) {
            dup.push(c.user_id);
          } else {
            console.log(c.user_id);
            this.chats.splice(i, 1);
          }
        });
      }
    }
  }

  ngOnInit() {
    this.isUserSignOut();

    // this.chatService
    //   .getUser(this.userId)
    //   .subscribe((user) => {
    //     this.user = user[0];
    //     this.chatService.allChatsPeople.subscribe((al_c_p) => {
    //       this.chats = al_c_p;
    //     });

    //     this.chatService.allChats.subscribe((al_c_v) => {
    //       this.all_chats = al_c_v;
    //     });
    //   })
    //   .add(() => {
    //     this.chats_loading = false;
    //     this.ngDoCheckInitialize = true;
    //     // console.log(this.chats, "client");
    //     this.initFunction();
    //     var e = this.all_chats.filter((i) => i.recieved == 1 && i.read == 0);
    //     var dup2 = [];
    //     this.unread_chats = e.filter(
    //       (item) => !dup2.includes(item.user_id) && dup2.push(item.user_id)
    //     );

    //     this.temp_chats = this.chats;
    //     this.allClients_temp = this.allClients;
    //     this.isAllClientsLoading = false;

    //     if (this.chats.length != 0 && this.unread_chats.length != 0) {
    //       this.unread_chats.forEach((un) => {
    //         this.chats.forEach((ch) => {
    //           if (un.user_id == ch.user_id) {
    //             Object.assign(ch, { new_msg: true });
    //           }
    //         });
    //       });
    //     }
    //   });
  }

  newChatOpen(c: any, url_opened?) {
    if (c.new_msg != undefined) {
      delete c.new_msg;
    }
    if (this.currentChat_usr != undefined) {
      // console.log("new chat opened");
      if (c.user_id != this.currentChat_usr.user_id) {
        this.chatroom_msgs.length = 0;
        this.currentChat_usr = c;

        if (this.all_chats.length != 0) {
          for (let index = 0; index < this.all_chats.length; index++) {
            if (
              this.all_chats[index]["send_to_id"] ==
                this.currentChat_usr.user_id ||
              this.all_chats[index]["sender_id"] == this.currentChat_usr.user_id
            ) {
              if (this.all_chats[index].image == 1) {
                Object.assign(this.all_chats[index], { loading: true });
              }
              this.chatroom_msgs.push(this.all_chats[index]);

              if (this.all_chats[index].recipient_id == this.userId) {
                this.chatService
                  .updateChatRead(this.all_chats[index].message_id)
                  .subscribe((v) => {});
              }
            }
          }
        }
      }

      if (url_opened == true) {
        // console.log("url chat....");
        this._location.go(`/user-chats?uid=${this.userId}`);
        if (this.all_chats.length != 0) {
          for (let index = 0; index < this.all_chats.length; index++) {
            if (
              this.all_chats[index]["send_to_id"] ==
                this.currentChat_usr.user_id ||
              this.all_chats[index]["sender_id"] == this.currentChat_usr.user_id
            ) {
              if (this.all_chats[index].image == 1) {
                Object.assign(this.all_chats[index], { loading: true });
              }
              this.chatroom_msgs.push(this.all_chats[index]);

              if (this.all_chats[index].recipient_id == this.userId) {
                this.chatService
                  .updateChatRead(this.all_chats[index].message_id)
                  .subscribe((v) => {});
              }
            }
          }
        }
      }
    } else {
      this.chatroom_msgs.length = 0;
      this.currentChat_usr = c;

      if (this.all_chats.length != 0) {
        for (let index = 0; index < this.all_chats.length; index++) {
          if (
            this.all_chats[index]["send_to_id"] ==
              this.currentChat_usr.user_id ||
            this.all_chats[index]["sender_id"] == this.currentChat_usr.user_id
          ) {
            this.chatroom_msgs.push(this.all_chats[index]);

            if (this.all_chats[index].recipient_id == this.userId) {
              this.chatService
                .updateChatRead(this.all_chats[index].message_id)
                .subscribe((v) => {});
            }
          }
        }
      }
    }

    setTimeout(() => {
      if (this.currentChatScroll != undefined) {
        this.scrollToBottom();
      }
    });
  }

  sideBarCloseChats() {
    // console.log("side-bar-closed");
    this.sidebarChatOpened == false
      ? (this.sidebarChatOpened = true)
      : (this.sidebarChatOpened = false);
  }

  downloadFile(path, file_data) {
    console.log(path);

    var file_name = this.getFileName(file_data);
    const baseUrl = "https://indusre.app/api/upload/chat/";

    const headers = new HttpHeaders().set("Access-Control-Allow-Origin", "*");

    this.http
      .get(baseUrl + path, { headers, responseType: "blob" as "json" })
      .subscribe((response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (file_name) downloadLink.setAttribute("download", file_name);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  getFileName(file) {
    return JSON.parse(file)["name"];
  }

  setupData(random_id, file, timeStamp, image) {
    if (image == true) {
      var chat_sender_data = {
        user_id: this.userId,
        message_id: random_id,
        send_to_id: this.currentChat_usr.user_id,
        recieved: 0,
      };

      var chat_recipient_data = {
        recipient_id: this.currentChat_usr.user_id,
        message_id: random_id,
        sender_id: this.userId,
        recieved: 1,
        read: 0,
      };

      var chat_message_data = {
        message_id: random_id,
        message: "",
        file: 0,
        file_data: "",
        file_path: "",
        image: 1,
        image_data: JSON.stringify({
          ext: file["ext"],
          name: file["name"],
          size: file["size"],
        }),
        image_path: `${random_id}.${file["ext"]}`,
        time: timeStamp,
      };
    } else {
      var chat_sender_data = {
        user_id: this.userId,
        message_id: random_id,
        send_to_id: this.currentChat_usr.user_id,
        recieved: 0,
      };

      var chat_recipient_data = {
        recipient_id: this.currentChat_usr.user_id,
        message_id: random_id,
        sender_id: this.userId,
        recieved: 1,
        read: 0,
      };

      var chat_message_data = {
        message_id: random_id,
        message: "",
        file: 1,
        file_data: JSON.stringify({
          ext: file["ext"],
          name: file["name"],
          size: file["size"],
        }),
        file_path: `${random_id}.${file["ext"]}`,
        image: 0,
        image_data: "",
        image_path: "",
        time: timeStamp,
      };
    }

    var data = {
      chat_sender_data: chat_sender_data,
      chat_recipient_data: chat_recipient_data,
      chat_message_data: chat_message_data,
    };

    return data;
  }

  pushToChatRoom(files: any[], timeStamp, image) {
    files.forEach((file) => {
      if (image == true) {
        this.chatroom_msgs.push({
          recieved: 0,
          image: 1,
          image_data: JSON.stringify({
            ext: file["ext"],
            name: file["name"],
            size: file["size"],
          }),
          image_path: `${file.random_id}.${file["ext"]}`,
          time: timeStamp,
          message_id: file.random_id,
          send_to_id: this.currentChat_usr.user_id,
          loading: true,
        });

        this.all_chats.push({
          recieved: 0,
          image: 1,
          image_data: JSON.stringify({
            ext: file["ext"],
            name: file["name"],
            size: file["size"],
          }),
          image_path: `${file.random_id}.${file["ext"]}`,
          time: timeStamp,
          message_id: file.random_id,
          send_to_id: this.currentChat_usr.user_id,
          loading: true,
        });
        this.sendImageMessageToSocket(file.random_id, file, timeStamp);
      } else {
        this.chatroom_msgs.push({
          recieved: 0,
          file: 1,
          file_data: JSON.stringify({
            ext: file["ext"],
            name: file["name"],
            size: file["size"],
          }),
          file_path: `${file.random_id}.${file["ext"]}`,
          message_id: file.random_id,
          send_to_id: this.currentChat_usr.user_id,
          time: timeStamp,
        });

        this.all_chats.push({
          recieved: 0,
          file: 1,
          file_data: JSON.stringify({
            ext: file["ext"],
            name: file["name"],
            size: file["size"],
          }),
          file_path: `${file.random_id}.${file["ext"]}`,
          message_id: file.random_id,
          send_to_id: this.currentChat_usr.user_id,
          time: timeStamp,
        });

        this.sendFileMessageToSocket(file.random_id, file, timeStamp);
      }
    });
  }

  async sendFileMsg(files: any[], image: boolean) {
    if (files != undefined && files.length != 0 && files != null) {
      this.sending_new_message = true;
      var timeStamp = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss", "en");

      let upload_data = [];
      var loop_completed = false;
      for (let index = 0; index < files.length; index++) {
        var random_id = this.otherServices.generateRandomID();
        var data = this.setupData(random_id, files[index], timeStamp, image);

        upload_data.push({
          data: files[index]["data"],
          fileID: random_id,
          ext: files[index]["ext"],
        });

        Object.assign(files[index], { random_id: random_id });

        this.chatService.sendChatMessage(JSON.stringify(data)).subscribe(() => {
          if (loop_completed == false) {
            if (upload_data.length == files.length) {
              loop_completed = true;
              this.chatService
                .uploadFileChat(JSON.stringify(upload_data))
                .subscribe((e) => {
                  // console.log(e);
                })
                .add(() => {
                  this.sending_new_message = false;
                  this.pushToChatRoom(files, timeStamp, image);
                });
            }
          }
        });
      }

      if (!this.chats.includes(this.currentChat_usr)) {
        // console.log('hellooo..new chat added')
        this.chats.push(this.currentChat_usr);
      }
    }
  }

  onImageError(msg, i) {
    // console.log("image got error");
    setTimeout(() => {
      msg.image_path = this.chatroom_msgs[i].image_path;
      msg.loading = false;
    }, 3000);
  }

  onImageLoad(msg, i) {
    msg.loading = false;

    $(`#chat_img${i}`).css("display", "block");

    // console.log("image not loaded");
  }

  onPaste(e) {
    new String(this.sending_msg).trim().replace(/[\r\n]+/, " ");
  }

  sendMsg() {
    if (this.sending_msg != undefined && this.sending_msg != "") {
      var timeStamp = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss", "en");
      var random_id = this.otherServices.generateRandomID();

      this.chatroom_msgs.push({
        recieved: 0,
        file: 0,
        image: 0,
        message: this.sending_msg,
        time: timeStamp,
        message_id: random_id,
        send_to_id: this.currentChat_usr.user_id,
      });

      this.all_chats.push({
        recieved: 0,
        file: 0,
        image: 0,
        message: this.sending_msg,
        time: timeStamp,
        message_id: random_id,
        send_to_id: this.currentChat_usr.user_id,
      });

      if (!this.chats.includes(this.currentChat_usr)) {
        this.chats.push(this.currentChat_usr);
      }

      var chat_sender_data = {
        user_id: this.userId,
        message_id: random_id,
        send_to_id: this.currentChat_usr.user_id,
        recieved: 0,
      };

      var chat_recipient_data = {
        recipient_id: this.currentChat_usr.user_id,
        message_id: random_id,
        sender_id: this.userId,
        recieved: 1,
        read: 0,
      };

      var chat_message_data = {
        message_id: random_id,
        message: this.sending_msg,
        file: 0,
        file_data: "",
        file_path: "",
        image: 0,
        image_data: "",
        image_path: "",
        time: timeStamp,
      };

      var data = {
        chat_sender_data: chat_sender_data,
        chat_recipient_data: chat_recipient_data,
        chat_message_data: chat_message_data,
      };

      this.sendMessageToSocket(random_id, this.sending_msg, timeStamp);

      this.chatService
        .sendChatMessage(JSON.stringify(data))
        .subscribe((val) => {})
        .add(() => {
          this.sending_msg = "";
        });
    }
  }

  sendMessageToSocket(random_id, msg, timeStamp) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var data = {
      sender_id: this.userId,
      user_id: this.userId,
      firstname: user[0]["firstname"],
      lastname: user[0]["lastname"],
      auth_type: user[0]["auth_type"],
      message_id: random_id,
      send_to_id: this.currentChat_usr.user_id,
      recieved: 1,
      file: 0,
      image: 0,
      message: msg,
      time: timeStamp,
      profile_photo: this.user.profile_photo,
      read: 0,
    };
    this.chatService.sendMessage(JSON.stringify(data));
  }

  sendFileMessageToSocket(random_id, file, timeStamp) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var data = {
      sender_id: this.userId,
      user_id: this.userId,
      firstname: user[0]["firstname"],
      lastname: user[0]["lastname"],
      auth_type: user[0]["auth_type"],
      message_id: random_id,
      send_to_id: this.currentChat_usr.user_id,
      recieved: 1,
      file: 1,
      file_data: JSON.stringify({
        ext: file["ext"],
        name: file["name"],
        size: file["size"],
      }),
      file_path: `${random_id}.${file["ext"]}`,
      message: "",
      time: timeStamp,
      profile_photo: this.user.profile_photo,
      read: 0,
    };
    this.chatService.sendMessage(JSON.stringify(data));
  }

  sendImageMessageToSocket(random_id, file, timeStamp) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var data = {
      sender_id: this.userId,
      user_id: this.userId,
      firstname: user[0]["firstname"],
      lastname: user[0]["lastname"],
      auth_type: user[0]["auth_type"],
      message_id: random_id,
      send_to_id: this.currentChat_usr.user_id,
      recieved: 1,
      image: 1,
      image_data: JSON.stringify({
        ext: file["ext"],
        name: file["name"],
        size: file["size"],
      }),
      image_path: `${random_id}.${file["ext"]}`,
      message: "",
      time: timeStamp,
      profile_photo: this.user.profile_photo,
      read: 0,
      loading: true,
    };
    this.chatService.sendMessage(JSON.stringify(data));
  }

  ngOnDestroy() {
    // socket observables..
    this.chatService.getMessage().subscribe().unsubscribe();
    this.chatService.getDeletedMessage().subscribe().unsubscribe();
    this.chatService.getUserOnline().subscribe().unsubscribe();
    this.chatService.getUserLeave().subscribe().unsubscribe();
  }
}
