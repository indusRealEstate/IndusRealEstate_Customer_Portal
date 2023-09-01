import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/announcement_api";

@Injectable({ providedIn: "root" })
export class AnnouncementService {
  constructor(
    private http: HttpClient,
  ) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  addAnnouncement(data: string) {
    const url = `${API_URL}/addAnnouncement.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  deleteAnnouncement(data: any) {
    const url = `${API_URL}/deleteAnnouncement.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  deleteAnnouncementDocs(data: any) {
    const url = `${API_URL}/deleteAnnouncementDocs.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  selectAllAnnouncement() {
    const url = `${API_URL}/selectAllAnnouncement.php?apikey=1`;
    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  selectSingleAnnouncementDetail(data: any) {
    const url = `${API_URL}/selectSingleAnnouncementDetail.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateAnnouncement(data: any) {
    const url = `${API_URL}/updateAnnouncement.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddAnnouncement(data: any) {
    const url = `${API_URL}/upload_add_announcement_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
