import { Injectable } from "@angular/core";

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, Observable, of } from "rxjs";

const API_URL = "https://indusre.app/api";

declare var gapi: any;

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
}
