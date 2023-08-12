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
import { Observable, map, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class FirebaseService {
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
    return await this.auth
      .signInWithEmailAndPassword("webtech@indusre.ae", "Ajeermdk@1820#")
      .then((result) => {
        // console.log(result.user);
      })
      .catch((error) => {
        console.log(error);
        // window.alert(error.message);
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
