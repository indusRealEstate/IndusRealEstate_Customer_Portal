import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
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
      responseType: 'blob'
    })
  }

  downloadFile(file_path) {
    return this.http
      .get(file_path, {
        responseType: "blob",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        },
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}

