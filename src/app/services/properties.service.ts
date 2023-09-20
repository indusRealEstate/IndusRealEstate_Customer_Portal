import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/properties_api";

@Injectable({ providedIn: "root" })
export class PropertiesService {
  constructor(private http: HttpClient) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  addProperty(data: any) {
    const url = `${API_URL}/addProperty.php`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getPropDetails(data: any) {
    const url = `${API_URL}/selectPropertyDetails.php`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateProperty(data: any) {
    const url = `${API_URL}/updateProperty.php`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  deleteProperty(property_id: any) {
    const url = `${API_URL}/delete_property.php`;
    return this.http
      .post<any>(url, JSON.stringify({ property_id: property_id }))
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  uploadAllFilesAddProperty(data: any) {
    const url = `${API_URL}/upload_add_property_files.php`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  uploadAllFilesEditProperty(data: any) {
    const url = `${API_URL}/upload_edit_property_files.php`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  getAllPropertiesPagination(limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_properties_pagination.php`;
    return this.http
      .post<any>(url, JSON.stringify({ limit: limit, pageNumber: pageNumber }))
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallPropertiesSearch(input: string, limit: number, pageNumber: number) {
    const url = `${API_URL}/getAllPropertiesAdmin_search.php`;
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

  getallPropertiesSearchPageChange(
    input: string,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_properties_page_change_search.php`;
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
