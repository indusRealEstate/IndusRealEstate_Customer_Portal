import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { User } from "../../../models/user/user.model";
import { OtherServices } from "./other.service";
import { Router } from "@angular/router";

const API_URL = "https://indusre.app/api/auth";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public isUserExist: boolean = false;
  public user: User;
  public userDoesntExist: boolean = false;

  constructor(
    private http: HttpClient,
    private otherServices: OtherServices,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const url = `${API_URL}/login.php?apikey=1`;

    return this.http
      .post<any>(url, { username: username, password: password })
      .pipe(
        map((userData) => {
          console.log(userData);
          // login successful if there's a jwt token in the response
          if (userData && userData[0]["token"]) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(userData));
            this.currentUserSubject.next(userData);
            sessionStorage.clear();
          }

          if (userData != null) {
            return userData;
          } else {
            return "invalid-user";
          }
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    localStorage.clear();
    sessionStorage.clear();

    setTimeout(() => {
      this.router.navigate(["/login"]);
      this.currentUserSubject.next(null);

      setTimeout(() => {
        this.otherServices.isLogoutProcessing.next(false);
      }, 1000);
    }, 500);
  }

  public fetchNewLandlordAllDetails(data: any) {
    const url = `${API_URL}/fetchNewLandlordAllDetails.php?apikey=1`;
    try {
      return this.http
        .post(url, data)
        .pipe(catchError(this.handleError("fetchNewLandlordAllDetails", [])));
    } catch (error) {
      console.log(error);
    }
  }

  public fetchNewTenantAllDetails(data: any) {
    const url = `${API_URL}/fetchNewTenantAllDetails.php?apikey=1`;
    try {
      return this.http
        .post(url, data)
        .pipe(catchError(this.handleError("fetchNewLandlordAllDetails", [])));
    } catch (error) {
      console.log(error);
    }
  }

  public addNewLandlord(data: any) {
    const url = `${API_URL}/addNewLandlord.php?apikey=1`;
    try {
      return this.http
        .post(url, data)
        .pipe(catchError(this.handleError("addNewLandlord", [])));
    } catch (error) {
      console.log(error);
    }
  }

  public addNewTenant(data: any) {
    const url = `${API_URL}/addNewTenant.php?apikey=1`;
    try {
      return this.http
        .post(url, data)
        .pipe(catchError(this.handleError("addNewLandlord", [])));
    } catch (error) {
      console.log(error);
    }
  }
}
