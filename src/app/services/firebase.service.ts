import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  Firestore,
  collection,
  collectionChanges,
} from "@angular/fire/firestore";
import { VAPIDKEYS } from "app/keys/vapid";
import { environment } from "environments/environment.prod";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { BehaviorSubject, Observable, map, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class FirebaseService {
  userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    public http: HttpClient,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private firestore: Firestore
  ) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
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

  getToken() {
    var app = initializeApp(environment.firebase);
    var messaging = getMessaging(app);
    getToken(messaging, { vapidKey: VAPIDKEYS.PUBLIC_KEY })
      .then((currentToken) => {
        if (currentToken) {
          console.log("Hurraaa!!! we got the token.....");
          console.log(currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  }
}
