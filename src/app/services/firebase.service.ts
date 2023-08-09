import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable, map, of } from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({ providedIn: "root" })
export class FirebaseService {
  constructor(
    public http: HttpClient,
    private db: AngularFirestore,
    private auth: AngularFireAuth
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
        console.log(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  getData() {
    var col = this.db
      .collection("service_requests")
      .valueChanges();

    return col;
  }
}
