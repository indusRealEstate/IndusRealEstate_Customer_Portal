import { Injectable } from "@angular/core";

import {
  HttpClient,
} from "@angular/common/http";
import { catchError, Observable, of} from "rxjs";

const API_URL = "https://indusre.app/api";

@Injectable({ providedIn: "root" })
export class EmailServices {
  constructor(public http: HttpClient) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  public sendEmail(data: any) {
    const url = `${API_URL}/mail-sender.php?apikey=1`;
    try {
      return this.http
        .post(url, data)
        .pipe(catchError(this.handleError("mail-sender", [])));
    } catch (error) {
      console.log(error);
    }
  }

  public getAllNewAuthRequests() {
    const url = `${API_URL}/auth/getAllNewAuthRequests.php?apikey=1`;
    try {
      return this.http
        .get(url)
        .pipe(catchError(this.handleError("getAllNewAuthRequests", [])));
    } catch (error) {
      console.log(error);
    }
  }

  public getAllUsersForChecking() {
    const url = `${API_URL}/auth/getAllUsersForChecking.php?apikey=1`;
    try {
      return this.http
        .get(url)
        .pipe(catchError(this.handleError("getAllUsersForChecking", [])));
    } catch (error) {
      console.log(error);
    }
  }

  public expireRegisterToken(data: any) {
    const url = `${API_URL}/auth/register_token_runOut.php?apikey=1`;
    try {
      return this.http
        .post(url, data)
        .pipe(catchError(this.handleError("register_token_runOut", [])));
    } catch (error) {
      console.log(error);
    }
  }
}
