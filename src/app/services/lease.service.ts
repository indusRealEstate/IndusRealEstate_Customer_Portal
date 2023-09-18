import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/lease_api";

@Injectable({ providedIn: "root" })
export class LeaseService {
  constructor(private http: HttpClient) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  getContractPaymentsCount(data: any) {
    const url = `${API_URL}/get_contract_payments_count.php`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addNewLease(data: any) {
    const url = `${API_URL}/addNewLease.php`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  deleteRemovedLeaseDocs(data: any) {
    const url = `${API_URL}/deleteRemovedLeaseDocs.php`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  downoadLeaseDoc(data: any) {
    const url = `${API_URL}/downloadLeaseDoc.php`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  editLease(data: any) {
    const url = `${API_URL}/editLease.php`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  reniewContract(data: any) {
    const url = `${API_URL}/reniewContract.php`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllContractsReminders(limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_contracts_reminders.php`;
    return this.http
      .post<any>(url, JSON.stringify({ limit: limit, pageNumber: pageNumber }))
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllLeaseData(data: any) {
    const url = `${API_URL}/getAllLeaseDetails.php`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  terminateLease(data: any) {
    const url = `${API_URL}/terminateLease.php`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddNewLease(data: any) {
    const url = `${API_URL}/upload_add_lease_files.php`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  getAllContractsAdminPagination(limit: number, pageNumber: number) {
    const url = `${API_URL}/getAllContractsAdmin_pagination.php`;
    return this.http
      .post<any>(url, JSON.stringify({ limit: limit, pageNumber: pageNumber }))
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallContractsSearch(input: string, limit: number, pageNumber: number) {
    const url = `${API_URL}/getAllContractsAdmin_search.php`;
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

  getallContractsSearchPageChange(
    input: string,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_contracts_page_change_search.php`;
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

  getallContractsFilter(filter: string, limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_contracts_by_filter.php`;
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

  getallContractsFilterPageChange(
    filter: string,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_all_contracts_by_filter_page_change.php`;
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
}
