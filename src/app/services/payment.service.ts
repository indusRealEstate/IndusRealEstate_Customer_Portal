import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/payment_api";

@Injectable({ providedIn: "root" })
export class PaymentService {
  constructor(
    private http: HttpClient,
  ) {}

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
}
