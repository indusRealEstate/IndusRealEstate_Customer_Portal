import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, last, map, tap } from "rxjs/operators";
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

  removeAllRequestsFromArchive(data: any) {
    const url = `${API_URL}/remove_all_requests_from_archive_spam.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getLatestServiceRequest(data: any) {
    const url = `${API_URL}/get_latest_service_requests.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllRequestsAdmin() {
    const url = `${API_URL}/get_all_requests_admin.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getArchivedRequestsAdmin() {
    const url = `${API_URL}/get_all_requests_admin_archive.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getSpamRequestsAdmin() {
    const url = `${API_URL}/get_all_requests_admin_spam.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllLeaseAdmin() {
    const url = `${API_URL}/getAllLeaseAdmin.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
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

  addUserBankDetails(data: any) {
    const url = `${API_URL}/add_user_bank_details.php?apikey=1`;
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

  editUnit(data: any) {
    const url = `${API_URL}/updateUnit.php?apikey=1`;
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

  addNewLease(data: any) {
    const url = `${API_URL}/addNewLease.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddProperty(data: any) {
    const url = `${API_URL}/upload_add_property_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  uploadAllFilesEditProperty(data: any) {
    const url = `${API_URL}/upload_edit_property_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  updateProperty(data: any) {
    const url = `${API_URL}/updateProperty.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddUnit(data: any) {
    const url = `${API_URL}/upload_add_unit_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  uploadAllFilesAddUser(data: any) {
    const url = `${API_URL}/upload_add_user_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  uploadAllFilesAddNewLease(data: any) {
    const url = `${API_URL}/upload_add_lease_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });

    return this.http.request(req);
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

  getPropDetails(data: any) {
    const url = `${API_URL}/selectPropertyDetails.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getRequestsDetails(data: any) {
    // console.log(data);
    const url = `${API_URL}/selectRequestsDetails.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  insertCategory(data: any) {
    const url = `${API_URL}/insert_request_category.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDownloadDocument(data: any) {
    //console.log(data);
    const url = `${API_URL}/downloadDocument.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllCategories(data: any) {
    const url = `${API_URL}/select_all_categories.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  deleteServiceCategory(data: any) {
    const url = `${API_URL}/deleteServiceCategory.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  selecteCategory() {
    const url = `${API_URL}/select_all_categories.php?apikey=1`;
    return this.http.get(url);
  }

  changeCategoryStatus(data: any) {
    const url = `${API_URL}/changeCategoryStatus.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateCategory(data: any) {
    const url = `${API_URL}/updateServiceCategory.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUnitAllData(data: any) {
    const url = `${API_URL}/selectUnitAllDetails.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  downoadLeaseDoc(data: any) {
    const url = `${API_URL}/downloadLeaseDoc.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllUserDetails(data: any) {
    const url = `${API_URL}/getUserAllDetails.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  downloadUserDocuments(data: any) {
    const url = `${API_URL}/downloadUserDocuments.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllLeaseData(data: any) {
    const url = `${API_URL}/getAllLeaseDetails.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateRequestMore(data: any) {
    const url = `${API_URL}/updateRequestMore.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateRequestStatus(data: any) {
    const url = `${API_URL}/updateRequestStatus.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  selectStaff() {
    const url = `${API_URL}/selectStaff.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  assignStaff(data: string) {
    const url = `${API_URL}/assignStaff.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  selectTenantsPaymentsDetails(data: any) {
   const url = `${API_URL}/selectTenantsPaymentsDetails.php?apikey=1`;
   return this.http.post(url, data).pipe(
     map((data) => {
       return data;
     })
   );
 }

 selectTenantPayments(data: string) {
   const url = `${API_URL}/selectTenantPayments.php?apikey=1`;
   return this.http.post(url, data).pipe(
     map((data) => {
       return data;
     })
   );
 }
 paymentsDetails(data: any) {
  const url = `${API_URL}/paymentsDetails.php?apikey=1`;
  return this.http.post(url, data).pipe(
    map((data) => {
      return data;
    })
  );
}
 
}
