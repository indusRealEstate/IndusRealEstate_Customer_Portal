import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../../../models/user/user.model";
import { catchError, Observable, of } from "rxjs";
import * as uuid from "uuid";

const API_URL = "https://indusre.app/api/auth";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  getAll() {
    return this.http.get<User[]>(`/users`);
  }

  register(user: User, user_id: any, auth_type?: any, userDetails?: any) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var token = possible;
    user.token = token;
    user.id = user_id;
    user.auth_type = auth_type;
    const url = `${API_URL}/register.php?apikey=1`;

    try {
      var res = this.http
        .post(url, user)
        .pipe(catchError(this.handleError("register", [])));

      return res;
    } catch (error) {}
  }

  addUserDetails(userDetails) {
    const url = `${API_URL}/addUserDetails.php?apikey=1`;
    return this.http
      .post(url, JSON.stringify(userDetails))
      .pipe(catchError(this.handleError("addUserDetails", [])));
  }

  delete(id: number) {
    return this.http.delete(`/users/${id}`);
  }

  //------------------------------------------------------

  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
