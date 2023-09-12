import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OtherServices } from "./other.service";

const API_URL = "https://indusre.app/api/admin";

@Injectable({ providedIn: "root" })
export class AdminService {
  constructor(public http: HttpClient, private otherServices: OtherServices) {}
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getallDataDashboard() {
    const url = `${API_URL}/get_all_data_dashboard.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getallStaffsAdmin() {
    const url = `${API_URL}/get_all_staffs.php?apikey=1`;
    return this.http.get<any>(url).pipe(
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

  getTablesCount(data: any) {
    const url = `${API_URL}/get_table_counts.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataForExcel(data: any) {
    const url = `${API_URL}/get_all_data_for_excel.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });

    return this.http.request(req);
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

  convertImgIntoWebp(data: any) {
    const url = `https://indusre.app/api/convert_img_to_webp.php?apikey=1`;

    return this.http
      .post(url, data)
      .pipe(catchError(this.handleError("saveImgInServer", [])));
  }
}
