import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/lease_api";

@Injectable({ providedIn: "root" })
export class LeaseService {
  constructor(
    private http: HttpClient,
  ) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  addNewLease(data: any) {
    const url = `${API_URL}/addNewLease.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  deleteRemovedLeaseDocs(data: any) {
    const url = `${API_URL}/deleteRemovedLeaseDocs.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
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

  editLease(data: any) {
    const url = `${API_URL}/editLease.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllContractsReminders() {
    const url = `${API_URL}/get_all_contracts_reminders.php?apikey=1`;
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

  getAllLeaseData(data: any) {
    const url = `${API_URL}/getAllLeaseDetails.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  terminateLease(data: any) {
    const url = `${API_URL}/terminateLease.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddNewLease(data: any) {
    const url = `${API_URL}/upload_add_lease_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}
