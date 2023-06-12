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

  chats: any[] = [0, 1, 0, 1];

  allClients: any[] = [];

  chats_loading: boolean = false;

  currentChat_usr: any;

  sidebarChatOpened: boolean = false;

  isAllClientsLoading: boolean = false;

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  chatroom_msgs: any[] = [];

  all_chats: any[] = [];

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

  attachFile() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.dialog
      .open(DocUploadDialogRegister, {
        width: "700px",
        height: "450px",
        data: { upload: "chat_file_upload" },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          this.sendFileMsg(res.data);
        } else {
        }
      });
  }

  getFileSize(file) {
    var size = JSON.parse(file)["size"];
    return this.otherServices.formatBytes(size);
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

        this.chats = this.all_chats;

        var dup = [];
        this.chats = val.filter(
          (item) => !dup.includes(item.user_id) && dup.push(item.user_id)
        );
      })
      .add(() => {
        this.chats_loading = false;
        this.initFunction();
      });
  }

  initFunction() {
    this.chatService.socket_connect();

    this.chatService.getMessage().subscribe((v) => {
      console.log(JSON.parse(v));
      var new_chat = JSON.parse(v);
      this.all_chats.push(new_chat);
      if (this.currentChat_usr != undefined) {
        if (this.currentChat_usr.user_id == new_chat.sender_id) {
          if (!this.chatroom_msgs.includes(new_chat)) {
            this.chatroom_msgs.push(new_chat);
          }
        }
      }

      if (this.chats.length != 0 && this.chats != undefined) {
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
    });
  }

  async ngOnInit() {
    sessionStorage.setItem("chat_refreshed_time", JSON.stringify(new Date()));

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
        this.isAllClientsLoading = false;
      });

    this.getAllChats();
  }

  newChatOpen(c: any) {
    if (c.new_msg != undefined) {
      delete c.new_msg;
    }

    this.chatroom_msgs.length = 0;
    this.currentChat_usr = c;

    if (this.all_chats.length != 0) {
      for (let index = 0; index < this.all_chats.length; index++) {
        if (
          this.all_chats[index]["send_to_id"] == this.currentChat_usr.user_id ||
          this.all_chats[index]["sender_id"] == this.currentChat_usr.user_id
        ) {
          this.chatroom_msgs.push(this.all_chats[index]);
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

  sendFileMsg(files: any[]) {
    if (files != undefined && files.length != 0 && files != null) {
      var timeStamp = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss", "en");

      console.log(files);

      for (let index = 0; index < files.length; index++) {
        var random_id = this.otherServices.generateRandomID();

        this.chatroom_msgs.push({
          recieved: 0,
          file: 1,
          file_data: JSON.stringify({
            ext: files[index]["ext"],
            name: files[index]["name"],
            size: files[index]["size"],
          }),
          time: timeStamp,
        });

        var chat_sender_data = {
          user_id: this.userId,
          message_id: random_id,
          send_to_id: this.currentChat_usr.user_id,
          recieved: 0,
        };

        var chat_recipient_data = {
          user_id: this.currentChat_usr.user_id,
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
            ext: files[index]["ext"],
            name: files[index]["name"],
            size: files[index]["size"],
          }),
          file_path: `${random_id}.${files[index]["ext"]}`,
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

        this.sendFileMessageToSocket(random_id, files[index], timeStamp);

        this.apiService
          .sendChatMessage(JSON.stringify(data))
          .subscribe((val) => {});

        this.apiService
          .uploadFileChat(
            JSON.stringify({
              file: files[index]["data"],
              fileID: random_id,
              ext: files[index]["ext"],
            })
          )
          .subscribe((e) => {
            console.log(e);
          });
      }

      if (!this.chats.includes(this.currentChat_usr)) {
        this.chats.push(this.currentChat_usr);
      }
      this.all_chats.length = 0;
      this.getAllChats();
    }
  }

  sendMsg() {
    if (this.sending_msg != undefined && this.sending_msg != "") {
      var timeStamp = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss", "en");

      this.chatroom_msgs.push({
        recieved: 0,
        file: 0,
        message: this.sending_msg,
        time: timeStamp,
      });

      if (!this.chats.includes(this.currentChat_usr)) {
        this.chats.push(this.currentChat_usr);
      }

      var random_id = this.otherServices.generateRandomID();
      var chat_sender_data = {
        user_id: this.userId,
        message_id: random_id,
        send_to_id: this.currentChat_usr.user_id,
        recieved: 0,
      };

      var chat_recipient_data = {
        user_id: this.currentChat_usr.user_id,
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
}
