import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, map, of } from "rxjs";

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
      responseType: "blob",
    });
  }

  downloadFile(file_path) {
    const headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
    // headers.set("Content-Type", "application/pdf");
    return this.http
      .get(file_path, {
        responseType: "blob",
        headers: headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
