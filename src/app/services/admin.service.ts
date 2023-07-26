import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { OtherServices } from "./other.service";

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

  getAllUsersAdmin() {
    const url = `${API_URL}/getAllUsersAdmin.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getallPropertiesAdmin() {
    const url = `${API_URL}/getAllProperties.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getallPropertiesUnitsAdmin() {
    const url = `${API_URL}/getAllPropertiesUnits.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addProperty(data: any) {
    const url = `${API_URL}/addProperty.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addUnit(data: any) {
    const url = `${API_URL}/addUnit.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addUser(data: any) {
    const url = `${API_URL}/addUser.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddProperty(data: any) {
    const url = `${API_URL}/upload_add_property_files.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddUnit(data: any) {
    const url = `${API_URL}/upload_add_unit_files.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddUser(data: any) {
    const url = `${API_URL}/upload_add_user_files.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addInventory(data: any) {
    const url = `${API_URL}/addInventory.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllClientsDocuments(userId: any) {
    const url = `${API_URL}/getAllClientsDocuments.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllClients(userId: any, auth: any) {
    const url = `${API_URL}/getAllClients.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId, auth: auth }).pipe(
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

  getUserAllDocuments(userId: any, client_id: any) {
    const url = `${API_URL}/getUserAllDocuments.php?apikey=1`;
    return this.http
      .post<any>(url, { userId: userId, client_id: client_id })
      .pipe(
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

  getAllRequestsAdmin(data: any) {
    const url = `${API_URL}/get_all_requests_admin.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllLandlordRequestsAdmin(data: any) {
    const url = `${API_URL}/get_all_landlord_requests_admin.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllTenantRequestsAdmin(data: any) {
    const url = `${API_URL}/get_all_tenant_requests_admin.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllRequestsAdminArchive(data: any) {
    const url = `${API_URL}/get_all_requests_admin_archive.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllRequestsAdminSpam(data: any) {
    const url = `${API_URL}/get_all_requests_admin_spam.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
