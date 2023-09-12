import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/user_api";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  addUserBankDetails(data: any) {
    const url = `${API_URL}/add_user_bank_details.php?apikey=1`;
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

  deleteRemovedUserFiles(data: any) {
    const url = `${API_URL}/deleteRemovedUserFiles.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
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

  editUser(data: any) {
    const url = `${API_URL}/editUser.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllUserAllocatedUnits(user_id: string, limit: number, pageNumber: number) {
    const url = `${API_URL}/get_user_allocated_units_pagination.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          limit: limit,
          pageNumber: pageNumber,
          user_id: user_id,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllUsersAdminPagination(limit: number, pageNumber: number) {
    const url = `${API_URL}/getAllUsersAdmin_pagination.php?apikey=1`;
    return this.http
      .post<any>(url, JSON.stringify({ limit: limit, pageNumber: pageNumber }))
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallUsersSearch(input: string, limit: number, pageNumber: number) {
    const url = `${API_URL}/getAllUsersAdmin_search.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({ input: input, limit: limit, pageNumber: pageNumber })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallUsersSearchPageChange(
    input: string,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_users_page_change_search.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({ input: input, limit: limit, pageNumber: pageNumber })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallUsersFilter(filter: string, limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_users_by_filter.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({ filter: filter, limit: limit, pageNumber: pageNumber })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallUsersFilterPageChange(
    filter: string,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_all_users_by_filter_page_change.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({ filter: filter, limit: limit, pageNumber: pageNumber })
      )
      .pipe(
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

  getUserDetailsForEdit(data: any) {
    const url = `${API_URL}/getUserDetailsForEdit.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddUser(data: any) {
    const url = `${API_URL}/upload_add_user_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}
