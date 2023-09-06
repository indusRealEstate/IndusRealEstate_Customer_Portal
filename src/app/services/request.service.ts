import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/requests_api";

@Injectable({ providedIn: "root" })
export class RequestService {
  constructor(private http: HttpClient) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  changeCategoryStatus(data: any) {
    const url = `${API_URL}/changeCategoryStatus.php?apikey=1`;
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

  getAllRequestsAdmin(limit: number, pageNumber: number, status: string) {
    const url = `${API_URL}/get_all_requests_admin.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({ limit: limit, pageNumber: pageNumber, status: status })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getArchivedRequestsAdmin(limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_requests_admin_archive.php?apikey=1`;
    return this.http
      .post<any>(url, JSON.stringify({ limit: limit, pageNumber: pageNumber }))
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllRequestsAdminFlag(limit, pageNumber, status) {
    const url = `${API_URL}/get_all_requests_admin_for_flag.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          limit: limit,
          pageNumber: pageNumber,
          status: status,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllRequestsAdminSearch(text, limit, pageNumber, status) {
    const url = `${API_URL}/get_all_requests_admin_for_search.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          input: text,
          limit: limit,
          pageNumber: pageNumber,
          status: status,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllArchivedRequestsSearch(text, limit, pageNumber) {
    const url = `${API_URL}/get_all_archive_requests_for_search.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          input: text,
          limit: limit,
          pageNumber: pageNumber,
        })
      )
      .pipe(
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

  getLatestServiceRequest(data: any) {
    const url = `${API_URL}/get_latest_service_requests.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  changePageRequestsFLag(limit, pageNumber, status) {
    const url = `${API_URL}/get_requests_page_change_flag.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          limit: limit,
          pageNumber: pageNumber,
          status: status,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  changePageRequestsSearch(text, limit, pageNumber, status) {
    const url = `${API_URL}/get_requests_page_change_search.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          input: text,
          limit: limit,
          pageNumber: pageNumber,
          status: status,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  changePageArchiveRequestsSearch(text, limit, pageNumber) {
    const url = `${API_URL}/get_archive_requests_page_change_search.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          input: text,
          limit: limit,
          pageNumber: pageNumber,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllRequestsAdminCount() {
    const url = `${API_URL}/getMaintenanceRequests_count.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllRequestsAdminCountByStatus(status) {
    const url = `${API_URL}/getMaintenanceRequests_count_by_status.php?apikey=1`;
    return this.http.post<any>(url, JSON.stringify({ status: status })).pipe(
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

  removeAllRequestsFromArchive(data: any) {
    const url = `${API_URL}/remove_all_requests_from_archive_spam.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
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

  selecteCategory() {
    const url = `${API_URL}/select_all_categories.php?apikey=1`;
    return this.http.get(url);
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

  updateCategory(data: any) {
    const url = `${API_URL}/updateServiceCategory.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
