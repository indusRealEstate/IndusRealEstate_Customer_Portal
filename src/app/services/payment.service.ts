import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/payment_api";

@Injectable({ providedIn: "root" })
export class PaymentService {
  constructor(private http: HttpClient) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  paidTenantPayment(data: string) {
    const url = `${API_URL}/paidTenantPayment.php?apikey=1`;
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

  selectPaymentAccordeingToTheMothod(data: string) {
    const url = `${API_URL}/selectPaymentAccordeingToTheMothod.php?apikey=1`;
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

  selectTenantsPaymentsDetails(data: any) {
    const url = `${API_URL}/selectTenantsPaymentsDetails.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  totalTenantPayment(data: string) {
    const url = `${API_URL}/totalTenantPayment.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  unpaidTenantPayment(data: string) {
    const url = `${API_URL}/unpaidTenantPayment.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getPaymentAllDetails(data: any) {
    const url = `${API_URL}/select_payment_details.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addNewPayment(data: any) {
    const url = `${API_URL}/add_new_payment.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  editPayment(data: any) {
    const url = `${API_URL}/edit_payment.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddNewPayment(data: any) {
    const url = `${API_URL}/upload_payment_docs.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  getAllPaymentsByContract(
    contract_id: any,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_all_payments_by_contract.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({
          limit: limit,
          pageNumber: pageNumber,
          contract_id: contract_id,
        })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllPaymentsPagination(limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_payments_pagination.php?apikey=1`;
    return this.http
      .post<any>(url, JSON.stringify({ limit: limit, pageNumber: pageNumber }))
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallPaymentsSearch(input: string, limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_payments_search.php?apikey=1`;
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

  getallPaymentsSearchPageChange(
    input: string,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_all_payments_page_change_search.php?apikey=1`;
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
}
