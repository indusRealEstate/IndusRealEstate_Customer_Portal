import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { OtherServices } from "./other.service";

const API_URL = "https://indusre.app/api/user";
const BASE_URL_IMAGES = "https://indusre.app/api/upload/img/properties";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(public http: HttpClient, private otherServices: OtherServices) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.otherServices.gotError.next(true);
      // this.otherServices.addMessage({
      //   message: "Error",
      //   description: error.error.error,
      // });

      // setTimeout(() => {
      //   this.otherServices.clearMessage();
      // }, 8000);

      return of(result as T);
    };
  }

  getBaseUrlImages() {
    return BASE_URL_IMAGES;
  }

  getUserDocuments(userId: any) {
    const url = `${API_URL}/getDocuments.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getLandlordTenantDocuments(userId: any) {
    const url = `${API_URL}/getLandlordTenantDocuments.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getLandlordTenants(userId: any) {
    const url = `${API_URL}/getLandlordTenants.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getLandlordDetails(userId: any) {
    const url = `${API_URL}/getLandlord_details.php?apikey=1`;
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

  getUserRequests(userId: any) {
    const url = `${API_URL}/getMyRequests.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUserPaymentRequests(userId: any) {
    const url = `${API_URL}/getPaymentRequests.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId}).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUserConditioningRequests(userId: any) {
    const url = `${API_URL}/getConditioningRequests.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUserMaintenanceRequests(userId: any) {
    const url = `${API_URL}/getMaintenanceRequests.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getUserTenantMoveInRequests(userId: any) {
    const url = `${API_URL}/getTenantMoveInRequests.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getUserTenantMoveOutRequests(userId: any) {
    const url = `${API_URL}/getTenantMoveOutRequests.php?apikey=1`;
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

  public getDocForView(doc_data: any) {
    const url = `https://indusre.app/api/getDocForView.php?apikey=1`;
    return this.http.post<any>(url, { doc_data: doc_data }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUser(userId: any) {
    const url = `${API_URL}/getUser.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getProperty(property_id: any) {
    const url = `${API_URL}/getProperty.php?apikey=1`;
    return this.http.post<any>(url, { propertyId: property_id }).pipe(
      map((data) => {
        return data[0];
      })
    );
  }

  getRequestLandlord(request_no: any) {
    const url = `${API_URL}/getRequest_landlord.php?apikey=1`;
    return this.http.post<any>(url, { request_no: request_no }).pipe(
      map((data) => {
        return data[0];
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
    const url = `${API_URL}/getUserProperties.php?apikey=1`;
    return this.http.post<any>(url, { userId: userId }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  requestPaymentService(data: any) {
    const url = `${API_URL}/requestPaymentService.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
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

  requestAddPropertyNewLandlord(data: any) {
    const url = `${API_URL}/add_property_new_landlord.php?apikey=1`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("requestAddPropertyNewLandlord", [])));
  }

  saveImgInServer(data: any) {
    const url = `https://indusre.app/api/uploader.php?apikey=1`;

    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("saveImgInServer", [])));
  }

  uploadReqDocInServer(data: any) {
    const url = `https://indusre.app/api/upload_req_doc.php?apikey=1`;

    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("uploadReqDocInServer", [])));
  }

  saveLandlordRegisterUploadFiles(data: any) {
    const url = `https://indusre.app/api/register_files_uploader.php?apikey=1`;

    return this.http
      .post(url, data)
      .pipe(
        catchError(this.handleError("saveLandlordRegisterUploadFiles", []))
      );
  }

  saveTenantRegisterUploadFiles(data: any) {
    const url = `https://indusre.app/api/register_files_uploader_tenant.php?apikey=1`;

    return this.http
      .post(url, data)
      .pipe(
        catchError(this.handleError("saveLandlordRegisterUploadFiles", []))
      );
  }

  removeAppointment(data: any) {
    const url = `${API_URL}/removeAppointment.php?apikey=1`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("removeAppointment", [])));
  }

  // downloadFile(data: Blob, filename: string, extension: string) {
  //   saveAs(data, `${filename}.${extension}`);
  // }
}
