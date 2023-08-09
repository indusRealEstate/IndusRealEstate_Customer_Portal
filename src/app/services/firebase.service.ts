import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class FirebaseService {
  constructor(public http: HttpClient) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }
}
