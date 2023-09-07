import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

const API_URL = "https://indusre.app/api/admin/units_api";

@Injectable({ providedIn: "root" })
export class UnitsService {
  constructor(private http: HttpClient) {}

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  addInventory(data: any) {
    const url = `${API_URL}/addInventory.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addUnit(data: any) {
    const url = `${API_URL}/addUnit.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getallUnitsFilter(filter: string, limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_units_by_filter.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({ filter: filter, limit: limit, pageNumber: pageNumber })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallUnitsFilterPageChange(
    filter: string,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_all_units_by_filter_page_change.php?apikey=1`;
    return this.http
      .post<any>(
        url,
        JSON.stringify({ filter: filter, limit: limit, pageNumber: pageNumber })
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallPropertiesUnits(limit: number, pageNumber: number) {
    const url = `${API_URL}/get_all_units_pagination.php?apikey=1`;
    return this.http
      .post<any>(url, JSON.stringify({ limit: limit, pageNumber: pageNumber }))
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getallPropertiesUnitsSearch(
    input: string,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_all_units_search.php?apikey=1`;
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

  getallUnitsSearchPageChange(
    input: string,
    limit: number,
    pageNumber: number
  ) {
    const url = `${API_URL}/get_units_page_change_search.php?apikey=1`;
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

  getallUnitTypes() {
    const url = `${API_URL}/getAll_unit_types.php?apikey=1`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getUnitAllData(data: any) {
    const url = `${API_URL}/selectUnitAllDetails.php?apikey=1`;
    return this.http.post(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  editUnit(data: any) {
    const url = `${API_URL}/updateUnit.php?apikey=1`;
    return this.http.post<any>(url, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadAllFilesAddUnit(data: any) {
    const url = `${API_URL}/upload_add_unit_files.php?apikey=1`;
    const req = new HttpRequest("POST", url, data, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}