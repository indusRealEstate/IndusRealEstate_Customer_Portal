import { Injectable } from "@angular/core";
import { Observable, of, throwError, Subscription } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, tap, map } from "rxjs/operators";
import { saveAs } from "file-saver";
import { OtherServices } from "./other.service";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

const API_URL = "http://127.0.0.1:8081/user";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(public http: HttpClient, private otherServices: OtherServices) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.otherServices.gotError.next(true);
      this.otherServices.addMessage({
        message: "Error",
        description: "Oh No! Something went wrong.",
      });

      setTimeout(() => {
        this.otherServices.clearMessage();
      }, 8000);

      return of(result as T);
    };
  }

  // getProperties() {
  //   const url = `${API_URL}/getproperties.php?apikey=1`;
  //   return this.http.get<any>(url).pipe(catchError(this.handleError('getProperties', [])));
  // }

  getUserDocuments(userId: any) {
    const url = `${API_URL}/getDocuments.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUserRecentHappenings(userId: any) {
    const url = `${API_URL}/getRecentHappenings.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addUserRecentHappenings(data: any) {
    const url = `${API_URL}/addRecentHappenings.php?apikey=1`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("addUserRecentHappenings", [])));
  }

  getUserRequestDetails(userId: any) {
    const url = `${API_URL}/getRequestDetails.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUserAppoinments(userId: any) {
    const url = `${API_URL}/getAppoinments.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUserDetails(userId: any) {
    const url = `${API_URL}/getUserDetails.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUserProperties(userId: any) {
    const url = `${API_URL}/getProperties.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addProperty(data: string) {
    const url = `${API_URL}/addProperty.php?apikey=1`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("addProperty", [])));
  }

  updateUserProfilePic(data: string) {
    const url = `${API_URL}/changeUserProfilePic.php?apikey=1`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("updateUserProfilePic", [])));
  }

  addAppointment(data: any) {
    const url = `${API_URL}/addAppointment.php?apikey=1`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("addAppointments", [])));
  }

  requestAddPropertyLandlord(data: any) {
    const url = `${API_URL}/requestAddProperty.php?apikey=1`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("requestAddPropertyLandlord", [])));
  }

  removeAppointment(data: any) {
    const url = `${API_URL}/removeAppointment.php?apikey=1`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("removeAppointment", [])));
  }

  downloadFile(data: Blob, filename: string, extension: string) {
    saveAs(data, `${filename}.${extension}`);
  }
}
