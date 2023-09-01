import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/properties_api";

@Injectable({ providedIn: "root" })
export class PropertiesService {
  constructor(
    private http: HttpClient,
  ) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  addProperty(data: any) {
    const url = `${API_URL}/addProperty.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getallPropertiesAdmin() {
    const url = `${API_URL}/getAllProperties.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getPropDetails(data: any) {
    const url = `${API_URL}/selectPropertyDetails.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateProperty(data: any) {
    const url = `${API_URL}/updateProperty.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddProperty(data: any) {
    const url = `${API_URL}/upload_add_property_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  uploadAllFilesEditProperty(data: any) {
    const url = `${API_URL}/upload_edit_property_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
