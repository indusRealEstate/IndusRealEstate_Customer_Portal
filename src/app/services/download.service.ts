import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class DownloadService {
  constructor(public http: HttpClient) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }
}
