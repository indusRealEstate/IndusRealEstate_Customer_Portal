import { Injectable, OnDestroy } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { OtherServices } from "./other.service";
import { ChatService } from "./chat.service";

const API_URL = "https://indusre.app/api/user";
const BASE_URL_IMAGES = "https://indusre.app/api/upload/img/properties";
const BASE_URL_DOC = "https://indusre.app/api/upload/doc/user-documents";

@Injectable({ providedIn: "root" })
export class ApiService implements OnDestroy {
  constructor(
    public http: HttpClient,
    private otherServices: OtherServices,
    private chatService: ChatService
  ) {}
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

  getBaseUrlDocs() {
    return BASE_URL_DOC;
  }

  downloadFile(file_path) {
    return this.http
      .get(file_path, {
        responseType: "blob",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        },
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
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
    return this.http.post<any>(url, { userId: userId }).pipe(
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

  getPropertyDocuments(prop_id: any) {
    const url = `${API_URL}/getPropertyDocuments.php?apikey=1`;
    return this.http.post<any>(url, { prop_id: prop_id }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getPropertyRequests(prop_id: any) {
    const url = `${API_URL}/getPropertyRequests.php?apikey=1`;
    return this.http.post<any>(url, { prop_id: prop_id }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUserInspectionRequests(userId: any) {
    const url = `${API_URL}/getInspectionRequests.php?apikey=1`;
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

  requestService(data: any) {
    const url = `${API_URL}/requestService.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  ///chatroom api calls.....//////////////////////////////////////////////////

  ngOnDestroy(): void {}

  fetchAllCLientsForChat(data: any) {
    const url = `${API_URL}/fetchAllCLientsForChat.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  fetchAllChatMessages(data: any) {
    const url = `${API_URL}/fetchAllChatMessages.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  fetchAllPeopleSendChats(data: any) {
    const url = `${API_URL}/fetchAllPeopleSendChats.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  deleteChatMessage(data: any) {
    const url = `${API_URL}/deleteChatMessage.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  sendChatMessage(data: any) {
    const url = `${API_URL}/sendChatMessage.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateChatRead(message_id: any) {
    const url = `${API_URL}/updateChatRead.php?apikey=1`;
    return this.http.post<any>(url, { message_id: message_id }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadFileChat(data: any) {
    const url = `https://indusre.app/api/uploadFileChat.php?apikey=1`;

    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("uploadFileChat", [])));
  }

  deleteFileFromServer(data: any) {
    const url = `https://indusre.app/api/deleteFileFromServer.php?apikey=1`;

    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("deleteFileFromServer", [])));
  }

  ///chatroom api calls ends.....//////////////////////////////////////////////////

  updateRequestFlag(req_id: any, update: any, req_type: any) {
    const url = `${API_URL}/updateRequestFlag.php?apikey=1`;
    return this.http
      .post<any>(url, { req_id: req_id, update: update, req_type: req_type })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateRequestArchive(req_id: any, update: any, req_type: any) {
    const url = `${API_URL}/updateRequestArchive.php?apikey=1`;
    return this.http
      .post<any>(url, { req_id: req_id, update: update, req_type: req_type })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateRequestSpam(req_id: any, update: any, req_type: any) {
    const url = `${API_URL}/updateRequestSpam.php?apikey=1`;
    return this.http
      .post<any>(url, { req_id: req_id, update: update, req_type: req_type })
      .pipe(
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
