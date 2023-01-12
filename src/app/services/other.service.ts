import { Injectable } from "@angular/core";
import { Observable, of, throwError, Subscription } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

const API_URL = "http://127.0.0.1:8081/user";

@Injectable({ providedIn: "root" })
export class OtherServices {
  constructor(public http: HttpClient) {}

  public isDialogClosed: boolean = false;
}
