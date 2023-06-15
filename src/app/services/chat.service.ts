import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer, of } from "rxjs";
import { OtherServices } from "./other.service";
import { io } from "socket.io-client";

@Injectable({ providedIn: "root" })
export class ChatService {
  constructor(public http: HttpClient, private otherServices: OtherServices) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.otherServices.gotError.next(true);

      return of(result as T);
    };
  }

  socket = io("https://www.ireproperty.com");

  socket_connect() {
    this.socket.on("connect", () => {
      console.log("socket connected");
    });
  }

  socket_disconnect() {
    this.socket.on("disconnect", () => {
      console.log("socket disconnect");
    });
  }

  user_online(userData) {
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
}
