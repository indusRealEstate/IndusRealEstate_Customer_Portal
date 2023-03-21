import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class OtherServices {
  constructor(public http: HttpClient) {}

  public isDialogClosed: boolean = false;
  public isLogoutProcessing: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isProfilePicUpdated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isUserSignedOut: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public messages: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public gotError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public miniSideBarClicked: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public adminRequestGotApproved: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public addMessage(data: any) {
    this.messages.next(data);
  }

  public clearMessage() {
    this.gotError.next(false);
    this.messages.next(null);
  }
}
