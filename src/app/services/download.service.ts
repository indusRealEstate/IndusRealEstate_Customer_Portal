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

  // download(url: string): Observable<Blob> {
  //   return this.http.get(url, {
  //     responseType: "blob",
  //   });
  // }

  downloadFile(file_path) {
    const url = `https://indusre.app/api/admin/downloadDocument.php`;
    return this.http
      .post(url, JSON.stringify({ file: file_path }), {
        headers: new HttpHeaders({
          Accept: "text/html, application/xhtml+xml, */*",
        }),
        responseType: "blob",
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  downloadRequestMedia(file_path) {
    const url = `https://indusre.app/api/mobile_app/download_media.php`;
    return this.http
      .post(url, JSON.stringify({ file: file_path }), {
        headers: new HttpHeaders({
          Accept: "text/html, application/xhtml+xml, */*",
        }),
        responseType: "blob",
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
