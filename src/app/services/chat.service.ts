import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Observer, of } from "rxjs";
import { OtherServices } from "./other.service";
import { io } from "socket.io-client";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class ChatService implements OnDestroy {
  constructor(
    public http: HttpClient,
    private otherServices: OtherServices,
    private apiService: ApiService
  ) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.otherServices.gotError.next(true);

      return of(result as T);
    };
  }

  public socket = io("https://www.ireproperty.com");

  socket_connect() {
    var userdata = localStorage.getItem("currentUser");
    var user_id = JSON.parse(userdata)[0]["id"];
    this.socket.on("connect", () => {
      // console.log("socket connected", this.socket.id);
      this.getAllCLients(user_id);
    });
  }

  socket_disconnect() {
    // console.log("socket disconnected");
    this.socket.disconnect();
  }

  user_online(userData) {
    // console.log("new user");
    this.socket.emit("user", userData);
  }

  user_leave(userData) {
    this.socket.emit("user_leave", userData);
  }

  createChatRoom() {
    this.socket.emit("room");
  }

  sendMessage(msg: string) {
    this.socket.emit("new_chat", msg);
  }

  deleteMessage(msg: string) {
    this.socket.emit("delete_chat", msg);
  }

  getUserOnline() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on("online", (userData: string) => {
        observer.next(userData);
      });
    });
  }

  getUserLeave() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on("not_online", (userData: string) => {
        observer.next(userData);
      });
    });
  }

  getMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on("msg", (message: string) => {
        observer.next(message);
      });
    });
  }

  getDeletedMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on("msg_del", (message: string) => {
        observer.next(message);
      });
    });
  }

  getSocketError() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on("err", (message: string) => {
        observer.next(message);
      });
    });
  }

  public allClients: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public allChatsPeople: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  public allChats: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  public new_joined_users: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  public leaved_user: BehaviorSubject<any> = new BehaviorSubject<any>("");

  getAllCLients(user_id) {
    this.getSocketError().subscribe((err) => {
      console.log(err);
    });

    this.apiService
      .fetchAllCLientsForChat({ userId: user_id })
      .subscribe((va: any[]) => {
        this.allClients.next(va);
      })
      .add(() => {
        this.setUserOnlineStatus().then(() => {
          this.user_online(JSON.stringify({ user_id: user_id }));
        });
      });

    this.apiService
      .fetchAllPeopleSendChats({ userId: user_id })
      .subscribe((v: any[]) => {
        this.allChatsPeople.next(v);
        // console.log(v, "api");
      });

    var e: any[] = [];
    this.apiService
      .fetchAllChatMessages({ userId: user_id })
      .subscribe((val: any[]) => {
        e = val;
        e.sort((a, b) => {
          const dt1 = Date.parse(a.time);
          const dt2 = Date.parse(b.time);

          if (dt1 < dt2) return -1;
          if (dt1 > dt2) return 1;
          return 0;
        });
      })
      .add(() => {
        this.allChats.next(e);
        this.setupMessageEmitter(user_id);
      });
  }

  async setUserOnlineStatus() {
    this.getUserOnline().subscribe((usr) => {
      var users: any[] = JSON.parse(usr);
      // console.log(users, "joined_users");

      this.new_joined_users.next(users);

      // this.all_chats.forEach((alch) => {
      //   users.forEach((u) => {
      //     if (alch.user_id == u.user_id) {
      //       Object.assign(alch, { online: true });
      //     }
      //   });
      // });

      // this.chats.forEach((ch) => {
      //   users.forEach((u) => {
      //     if (ch.user_id == u.user_id) {
      //       Object.assign(ch, { online: true });
      //     }
      //   });
      // });
    });

    this.getUserLeave().subscribe((usr) => {
      var user = JSON.parse(usr);
      // console.log(user, "leaved_users");
      this.leaved_user.next(user);
      // this.all_chats.forEach((alch) => {
      //   if (alch.user_id == user.user_id) {
      //     if (alch.online != undefined) {
      //       alch.online = false;
      //     }
      //   }
      // });

      // this.chats.forEach((ch) => {
      //   if (ch.user_id == user.user_id) {
      //     if (ch.online != undefined) {
      //       ch.online = false;
      //     }
      //   }
      // });
    });
  }

  public newRecievedMessage: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public deletedMessage: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  setupMessageEmitter(user_id) {
    this.getMessage().subscribe((v) => {
      var new_chat = JSON.parse(v);

      if (new_chat.send_to_id == user_id) {
        this.newRecievedMessage.next(new_chat);
      }
    });

    this.getDeletedMessage().subscribe((e) => {
      var message = JSON.parse(e);
      // console.log(message, "deleted");
      if (message.send_to_id == user_id) {
        this.deletedMessage.next(message);
      }
    });
  }

  ngOnDestroy(): void {
    this.allClients.unsubscribe();
    this.allChats.unsubscribe();
    this.allChatsPeople.unsubscribe();
    this.new_joined_users.unsubscribe();
    this.leaved_user.unsubscribe();
    this.newRecievedMessage.unsubscribe();
    this.deletedMessage.unsubscribe();
    this.getUserOnline().subscribe().unsubscribe();
    this.getUserLeave().subscribe().unsubscribe();
    this.getMessage().subscribe().unsubscribe();
    this.getDeletedMessage().subscribe().unsubscribe();
  }
}
