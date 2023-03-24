import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of } from "rxjs";

const API_URL = "https://indusmanagement.ae/api/auth";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  request_register(data: any) {
    const url = `${API_URL}/request_register.php?apikey=1`;

    try {
      var res = this.http
        .post(url, data)
        .pipe(catchError(this.handleError("request_register", [])));

      return res;
    } catch (error) {}
  }

  request_register_tenant(data: any) {
    const url = `${API_URL}/request_register_tenant.php?apikey=1`;

    try {
      var res = this.http
        .post(url, data)
        .pipe(catchError(this.handleError("request_register_tenant", [])));

      return res;
    } catch (error) {}
  }

  addUserDetails(userDetails) {
    const url = `${API_URL}/addUserDetails.php?apikey=1`;
    return this.http
      .post(url, JSON.stringify(userDetails))
      .pipe(catchError(this.handleError("addUserDetails", [])));
  }
}
