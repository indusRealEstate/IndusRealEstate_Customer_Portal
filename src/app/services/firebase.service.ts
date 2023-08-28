import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";
import {
  Firestore,
  collection,
  collectionChanges,
} from "@angular/fire/firestore";
import { BehaviorSubject, Observable, map, of } from "rxjs";

// import { Messaging } from '@angular/fire/messaging';

@Injectable({ providedIn: "root" })
export class FirebaseService {
  userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  currentToken: any = "";
  constructor(
    public http: HttpClient,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private firestore: Firestore,
    private msg: AngularFireMessaging
  ) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  requestToken() {
    this.msg.requestToken.subscribe(
      async (token: any) => {
        // console.log(token);
        this.currentToken = token;
        await this.db
          .collection("push_notification")
          .doc("admin")
          .set({ token: token });
      },
      (err: any) => {
        console.error("Unable to get permission to notify.", err);
      }
    );
  }

  recieveMessages() {
    this.msg.messages.subscribe((payload) => {
      console.log("new msg recieved", payload);
    });
  }

  sendPushNotification(title: string, body: string, prop_id: string) {
    var post_obj = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        prop_id: prop_id,
      },
      to: "/topics/all",
    };
    const url = "https://fcm.googleapis.com/fcm/send";
    return this.http
      .post<any>(url, JSON.stringify(post_obj), {
        headers: {
          Authorization:
            "key=AAAANZTwjCs:APA91bHYWwS8S_rwe5bxYHd8ad7H38Xxfj2j47nW-t3e6XXrekwjdcYjM3Je6afwh9xEtlEErQNU5THugPnTWF7mm83acWHLAybssRuzIf1vIHTYO8OZoe6bG3HoyQSU15GFpINDuiwV",
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  async firebaseLogin() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        // console.log("already logged in");
        this.userLoggedIn.next(true);
      } else {
        // console.log("logging in..");
        // this.userLoggedIn.next(false);
        await this.auth
          .signInWithEmailAndPassword("webtech@indusre.ae", "Ajeermdk@1820#")
          .then((result) => {
            // console.log(result);
          })
          .catch((error) => {
            console.log(error);
            // window.alert(error.message);
          });
      }
    });
  }

  async getAllContractsReminders() {
    return collectionChanges(
      collection(this.firestore, "contract_reminders")
    ).pipe(
      map((items) =>
        items.map((item) => {
          const data = item.doc.data();
          const id = item.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  async addContractReminder(contract_id, days_left) {
    await this.db.collection("contract_reminders").doc(contract_id).set({
      days_left: days_left,
      timestamp: new Date(),
    });
  }

  async addNewAnnouncement(announcement_id, prop_id) {
    await this.db.collection("announcements").doc(announcement_id).set({
      prop_id: prop_id,
      timestamp: new Date(),
    });
  }

  getData() {
    return collectionChanges(
      collection(this.firestore, "service_requests")
    ).pipe(
      map((items) =>
        items.map((item) => {
          const data = item.doc.data();
          const id = item.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  async deleteData(id) {
    await this.db.collection("service_requests").doc(id).delete();
  }

  async deleteAnnouncementData(id) {
    await this.db.collection("announcements").doc(id).delete();
  }

  async requestMessagePermission() {
    if (Notification.permission !== "granted") {
      var res = await Notification.requestPermission();
      return res;
    } else {
      return "granted";
    }
  }
}
