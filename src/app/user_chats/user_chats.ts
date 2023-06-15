import { formatDate } from "@angular/common";
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
import { ApiService } from "app/services/api.service";
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

  sending_msg: any;

  search_chats: any = "";

  search_clients: any = "";

  chats: any[] = [0, 1, 0, 1];

  temp_chats: any[] = [];

  allClients: any[] = [];

  allClients_temp: any[] = [];

  chats_loading: boolean = false;

  currentChat_usr: any;

  sidebarChatOpened: boolean = false;

  isAllClientsLoading: boolean = false;

  sending_new_message: boolean = false;

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";
  chatImgsPath: any = "https://indusre.app/api/upload/chat/";

  chatroom_msgs: any[] = [];

  all_chats: any[] = [];

  unread_chats: any[] = [];

  socket_dups: any[] = [];

  uploadedFiles: any[] = [];

  constructor(
    private apiService: ApiService,
    private chatService: ChatService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices,
    private http: HttpClient,
    private dialog?: MatDialog
  ) {
    this.sidebarChatOpened = true;
    this.isAllClientsLoading = true;
    this.chats_loading = true;
    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.userId = user[0]["id"];

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate(["/user-chats"], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate(["/user-chats"], {
          queryParams: { uid: user[0]["id"] },
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
    try {
      this.currentChatScroll.nativeElement.scrollTop =
        this.currentChatScroll.nativeElement.scrollHeight;
    } catch (err) {}
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  deleteMessage(msg, i) {
    this.apiService
      .deleteChatMessage({ message_id: msg.message_id })
      .subscribe((v) => {
        // console.log(v);
      });

    if (msg.file == 1) {
      this.apiService
        .deleteFileFromServer({ file_name: msg.file_path })
        .subscribe((e) => {});
    }

    if (msg.image == 1) {
      this.apiService
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

  getAllChats() {
    this.apiService
      .fetchAllChatMessages({ userId: this.userId })
      .subscribe((val: any[]) => {
        // console.log(val);
        this.all_chats = val;
        // console.log(val);
        this.all_chats.sort((a, b) => {
          const dt1 = Date.parse(a.time);
          const dt2 = Date.parse(b.time);

          if (dt1 < dt2) return -1;
          if (dt1 > dt2) return 1;
          return 0;
        });

        var dup = [];
        this.chats = this.all_chats.filter(
          (item) => !dup.includes(item.user_id) && dup.push(item.user_id)
        );

        var e = val.filter((i) => i.recieved == 1 && i.read == 0);
        var dup2 = [];
        this.unread_chats = e.filter(
          (item) => !dup2.includes(item.user_id) && dup2.push(item.user_id)
        );
      })
      .add(() => {
        this.chats_loading = false;
        this.initFunction();
        this.temp_chats = this.chats;

        if (this.chats.length != 0 && this.unread_chats.length != 0) {
          this.unread_chats.forEach((un) => {
            this.chats.forEach((ch) => {
              if (un.user_id == ch.user_id) {
                Object.assign(ch, { new_msg: true });
              }
            });
          });
        }
      });
  }

  initFunction() {
    this.chatService.socket_connect();
    this.chatService.user_online(JSON.stringify({ user_id: this.userId }));

    this.chatService.getUserOnline().subscribe((usr) => {
      var user = JSON.parse(usr);
      // console.log(user);

      this.allClients.forEach((va) => {
        if (va.user_id == user.user_id) {
          Object.assign(va, { online: true });
        }
      });

      this.all_chats.forEach((alch) => {
        if (alch.user_id == user.user_id) {
          Object.assign(alch, { online: true });
        }
      });

      this.chats.forEach((ch) => {
        if (ch.user_id == user.user_id) {
          Object.assign(ch, { online: true });
        }
      });
    });

    this.chatService.getUserLeave().subscribe((usr) => {
      var user = JSON.parse(usr);
      // console.log(user);

      this.allClients.forEach((va) => {
        if (va.user_id == user.user_id) {
          if (va.online != undefined) {
            va.online = false;
          }
        }
      });

      this.chats.forEach((ch) => {
        if (ch.user_id == user.user_id) {
          if (ch.online != undefined) {
            ch.online = false;
          }
        }
      });
    });

    this.chatService.getMessage().subscribe((v) => {
      var new_chat = JSON.parse(v);
      // console.log(new_chat, "new msg");

      if (new_chat.send_to_id == this.userId) {
        this.all_chats.push(new_chat);
        if (this.currentChat_usr != undefined) {
          if (this.currentChat_usr.user_id == new_chat.sender_id) {
            this.chatroom_msgs.push(new_chat);
          }
        }

        if (this.chats.length != 0 && this.chats != undefined) {
          for (let index = 0; index < this.allClients.length; index++) {
            if (this.allClients[index].user_id == new_chat.sender_id) {
              // console.log("new user msg");

              var e = this.chats.filter(
                (v) => v.user_id == this.allClients[index].user_id
              );

              if (e.length == 0) {
                var obj = this.allClients[index];
                Object.assign(obj, {
                  new_msg: true,
                });
                this.chats.push(obj);
              }
            }
          }

          for (let index = 0; index < this.chats.length; index++) {
            if (this.chats[index].user_id == new_chat.sender_id) {
              Object.assign(this.chats[index], { new_msg: true });
            }
          }
        } else {
          for (let index = 0; index < this.all_chats.length; index++) {
            if (this.all_chats[index].user_id == new_chat.user_id) {
              this.chats.push(this.all_chats[index]);
              Object.assign(this.chats[0], { new_msg: true });
            }
          }
        }
      }

      var dup = [];
      this.chatroom_msgs = this.chatroom_msgs.filter(
        (item) => !dup.includes(item.message_id) && dup.push(item.message_id)
      );
    });

    this.chatService.getDeletedMessage().subscribe((e) => {
      var message = JSON.parse(e);
      // console.log(message, "deleted");
      if (message.send_to_id == this.userId) {
        for (let index = 0; index < this.all_chats.length; index++) {
          if (message.msg_id == this.all_chats[index].message_id) {
            this.all_chats.splice(index, 1);
          }
        }

        if (this.currentChat_usr != undefined) {
          for (let index = 0; index < this.chatroom_msgs.length; index++) {
            if (message.msg_id == this.chatroom_msgs[index].message_id) {
              this.chatroom_msgs.splice(index, 1);
            }
          }
        }
      }
    });
  }

  async ngOnInit() {
    this.isUserSignOut();

    this.apiService.getUser(this.userId).subscribe((user) => {
      this.user = user[0];
    });

    this.apiService
      .fetchAllCLientsForChat({ userId: this.userId })
      .subscribe((va) => {
        this.allClients = va;
      })
      .add(() => {
        this.allClients_temp = this.allClients;
        this.isAllClientsLoading = false;
      });

    this.getAllChats();
  }

  newChatOpen(c: any) {
    // this.chatService.createChatRoom();
    if (c.new_msg != undefined) {
      delete c.new_msg;
    }
    if (this.currentChat_usr != undefined) {
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
                this.apiService
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
              this.apiService
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
        // console.log("scrolling");
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

        this.apiService.sendChatMessage(JSON.stringify(data)).subscribe(() => {
          if (loop_completed == false) {
            if (upload_data.length == files.length) {
              loop_completed = true;
              this.apiService
                .uploadFileChat(JSON.stringify(upload_data))
                .subscribe((e) => {
                  console.log(e);
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
        this.chats.push(this.currentChat_usr);
      }
      this.all_chats.length = 0;
      this.getAllChats();
    }
  }

  onImageError(msg, i) {
    console.log("image got error");
    setTimeout(() => {
      msg.image_path = this.chatroom_msgs[i].image_path;
      msg.loading = false;
    }, 3000);
  }

  onImageLoad(msg, i) {
    msg.loading = false;

    $(`#chat_img${i}`).css("display", "block");

    console.log("image not loaded");
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

      this.apiService
        .sendChatMessage(JSON.stringify(data))
        .subscribe((val) => {})
        .add(() => {
          this.all_chats.length = 0;
          this.getAllChats();
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
      loading: true,
    };
    this.chatService.sendMessage(JSON.stringify(data));
  }

  ngOnDestroy() {
    this.chatService.getMessage().subscribe().unsubscribe();
    this.chatService.socket_disconnect();
    this.chatService.user_leave(JSON.stringify({ user_id: this.userId }));
  }
}
