import { Injectable } from "@angular/core";
import {
  Observable,
  of,
  throwError,
  Subscription,
  BehaviorSubject,
} from "rxjs";
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
  public isLogoutProcessing: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isProfilePicUpdated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public messages: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public gotError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public addMessage(data: any) {
    this.messages.next(data);
  }

  public clearMessage() {
    this.gotError.next(false);
    this.messages.next(null);
  }
}
