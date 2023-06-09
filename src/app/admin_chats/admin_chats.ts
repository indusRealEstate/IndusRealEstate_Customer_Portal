import { formatDate } from "@angular/common";
import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "admin-chats",
  templateUrl: "./admin_chats.html",
  styleUrls: ["./admin_chats.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AdminChats implements OnInit {
  isUserSignedIn: boolean = false;

  userId: any;

  sending_msg: any;

  chats: any[] = [0, 1, 0, 1];

  allClients: any[] = [];

  chats_loading: boolean = false;

  currentChat_usr: any;

  isAllClientsLoading: boolean = false;

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  chatroom_msgs: any[] = [];

  all_chats: any[] = [];

  constructor(
    private apiService: ApiService,
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    this.isAllClientsLoading = true;
    this.chats_loading = true;
    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.userId = user[0]["id"];

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate(["/admin-chats"], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate(["/admin-chats"], {
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
      });
  }

  // ngDoCheck() {
  //   if (sessionStorage.getItem("chat_refreshed_time") != null) {
  //     var old_time = new Date(
  //       JSON.parse(sessionStorage.getItem("chat_refreshed_time"))
  //     );

  //     var new_time = new Date();

  //     if (new_time.getTime() - old_time.getTime() >= 10000) {
  //       this.getAllChats();
  //       sessionStorage.setItem(
  //         "chat_refreshed_time",
  //         JSON.stringify(new Date())
  //       );
  //       console.log("refreshed");
  //     }
  //   }
  // }

  async ngOnInit() {
    sessionStorage.setItem("chat_refreshed_time", JSON.stringify(new Date()));

    this.isUserSignOut();

    // this.apiService.connect_socket("h").subscribe((v) => {
    //   console.log(v);
    // });

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
    this.chatroom_msgs.length = 0;
    this.currentChat_usr = c;
    // console.log(this.all_chats);

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

      // console.log(timeStamp);

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

      this.apiService
        .sendChatMessage(JSON.stringify(data))
        .subscribe((val) => {});

      this.sending_msg = "";
    }
  }
}
