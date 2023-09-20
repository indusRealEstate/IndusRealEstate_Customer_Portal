import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { User } from "../models/user.model";
import { OtherServices } from "./other.service";
import * as CryptoJS from "crypto-js";
import * as moment from "moment";

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

  // private setSession(authResult) {
  //   const parsed_json = JSON.parse(window.atob(authResult.split(".")[1]));
  //   const expiresAt = moment().add(parsed_json.exp, "second");

  //   localStorage.setItem("id_token", authResult);
  //   localStorage.setItem("token_raw", parsed_json);
  //   localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  // }

  // getExpiration() {
  //   const expiration = localStorage.getItem("expires_at");
  //   const expiresAt = JSON.parse(expiration);
  //   return moment(expiresAt);
  // }

  private getAuthorizationHeaders(): HttpHeaders {
    const token = localStorage.getItem("token");
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return headers;
  }

  validateToken() {
    const url = `https://indusre.app/api/validate_token.php`;
    return this.http
      .get<any>(url, { headers: this.getAuthorizationHeaders() })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  // decodeToken(token: string) {
  //   const key = "fcvxcnfrhrtghkfghgwerikdf";
  //   const rec_hash = token.split(".")[2];
  //   const client_hash = CryptoJS.HmacSHA512(
  //     `${token.split(".")[0]}.${token.split(".")[1]}`,
  //     key
  //   ).toString(CryptoJS.enc.Base64);

  //   if (this.base64UrlDecode(rec_hash) == client_hash) {
  //     this.setSession(token);
  //     return token;
  //   } else {
  //     return "fail";
  //   }
  // }

  // base64UrlDecode(text: string) {
  //   var text1 = text.replace(/-/g, "+");
  //   var text2 = text1.replace(/_/g, "/");
  //   var text3 = text2.replace(/#/g, "=");
  //   return text3;
  // }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const url = `${API_URL}/login.php`;

    return this.http
      .post<any>(url, { username: username, password: password })
      .pipe(
        map((userData) => {
          if (userData != "invalid-user") {
            console.log(userData);
            localStorage.setItem(
              "currentUser",
              JSON.stringify(userData.userData)
            );
            localStorage.setItem("token", JSON.stringify(userData.token));
            // this.getJWTToken().subscribe((tkn) => {
            //   const res = this.decodeToken(tkn);
            //   if (res != "fail") {
            this.router.navigate(["/dashboard"]);
            //   }
            // });
            this.currentUserSubject.next(userData.userData);
            sessionStorage.clear();
          }

          if (userData != "invalid-user") {
            return userData;
          } else {
            return "invalid-user";
          }
        })
      );
  }

  async getIPAddress() {
    var api_key = "a9e468d770944e39b04fca46e16d36cc";
    return this.http
      .get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${api_key}`)
      .subscribe((res) => {
        console.log(res);
      });
  }

  public storeClientIP(data: any) {
    const url = `${API_URL}/storeClientIP.php`;
    try {
      return this.http
        .post(url, data)
        .pipe(catchError(this.handleError("storeClientIP", [])));
    } catch (error) {
      console.log(error);
    }
  }

  public getLocalIP() {
    var result: string;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        // video: true,
      })
      .then((stream) => {
        // stream.getTracks().forEach(function (track) {
        //   track.stop();
        // });
        window.RTCPeerConnection = window.RTCPeerConnection; //compatibility for firefox and chrome
        var pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.services.mozilla.com" }],
        });
        var noop = () => {};
        pc.createDataChannel(""); //create a bogus data channel
        pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description
        pc.onicecandidate = (ice) => {
          //listen for candidate events
          // if (!ice || !ice.candidate || !ice.candidate.candidate) {
          result = ice.candidate.address;
          pc.onicecandidate = noop;
          // }
          // var myIP =
          //   /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(
          //     ice.candidate.candidate
          //   )[1];
          // console.log("my IP: ", myIP);
        };
      })
      .catch((err) => {
        // console.log(err);
        result = "FAILED";
      });

    return result;
  }

  logout() {
    this.otherServices.isLogoutProcessing.next(true);
    // setTimeout(() => {});
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    localStorage.clear();
    sessionStorage.clear();

    setTimeout(() => {
      this.currentUserSubject.next(null);
      setTimeout(() => {
        this.router.navigate(["/login"]);
        this.otherServices.isLogoutProcessing.next(false);
        this.otherServices.isUserSignedOut.next(true);
        this.otherServices.userSignedIn.next(false);
      }, 500);
    });
  }
}
