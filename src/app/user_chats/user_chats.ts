import { formatDate } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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

  constructor(
    private apiService: ApiService,
    private chatService: ChatService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices
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
      // console.log(JSON.parse(v));
      var new_chat = JSON.parse(v);
      this.all_chats.push(new_chat);
      if (this.currentChat_usr != undefined) {
        if (this.currentChat_usr.user_id == new_chat.sender_id) {
          this.chatroom_msgs.push(new_chat);
        }
      }

      if (this.chats.length != 0 && this.chats != undefined) {
        for (let index = 0; index < this.chats.length; index++) {
          if (this.chats[index].user_id == new_chat.sender_id) {
            Object.assign(this.chats[index], { new_msg: true });
          }
        }
      }
    });
  }

  async ngOnInit() {
    sessionStorage.setItem("chat_refreshed_time", JSON.stringify(new Date()));

    this.isUserSignOut();

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

  sendMsg() {
    if (this.sending_msg != undefined && this.sending_msg != "") {
      var timeStamp = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss", "en");

      this.chatroom_msgs.push({
        recieved: 0,
        message: this.sending_msg,
        time: timeStamp,
      });

      if (!this.chats.includes(this.currentChat_usr)) {
        this.chats.push(this.currentChat_usr);
      }
      this.all_chats.length = 0;
      this.getAllChats();

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
        .subscribe((val) => {});

      this.sending_msg = "";
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
      message: msg,
      time: timeStamp,
    };
    this.chatService.sendMessage(JSON.stringify(data));
  }
}
