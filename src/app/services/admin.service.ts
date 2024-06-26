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

const API_URL = "https://indusre.app/api/admin";

@Injectable({ providedIn: "root" })
export class AdminService {
  constructor(public http: HttpClient, private otherServices: OtherServices) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.otherServices.gotError.next(true);
      this.otherServices.addMessage({
        message: "Error",
        description: error.error.error,
      });

      setTimeout(() => {
        this.otherServices.clearMessage();
      }, 8000);

      return of(result as T);
    };
  }

  getAllProperties(userId: any) {
    const url = `${API_URL}/getAllProperties.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllClients(userId: any) {
    const url = `${API_URL}/getAllClients.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllClientsDetails(userId: any) {
    const url = `${API_URL}/getAllClientsDetails.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllAddPropertyRequests(userId: any) {
    const url = `${API_URL}/getAllAddPropertyRequests.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllPaymentRequests(userId: any) {
    const url = `${API_URL}/getAllPaymentRequests.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllNewLandlordACCRequest(userId: any) {
    const url = `${API_URL}/getAllNewLandlordACCRequest.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllNewTenantACCRequest(userId: any) {
    const url = `${API_URL}/getAllNewTenantACCRequest.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  approveRequest(data: any) {
    const url = `${API_URL}/changeRequestApproval.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  declineRegisterToken(data: any) {
    const url = `${API_URL}/register_token_decline.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
