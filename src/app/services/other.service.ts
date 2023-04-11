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

  /////////////////////////////////////////////////////

  public homeClickedTenantReg: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public propertyPageClickedUserProfile: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public overviewClickedpropertyPage: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public myRequestsClickedrequestPage: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public myRequestClickedHome: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public myPropertiesClickedHome: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public reportsClickedHome: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public customerCareClickedHome: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public allRequestsClickedAdminDashboard: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public tenantRequestsDropDownCloseLandlord: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);


  public requestsToggle: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public servicePageToggle: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // public adminCLientsPageToggle: BehaviorSubject<boolean> =
  //   new BehaviorSubject<boolean>(false);

  public adminPropertyPageToggle: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  //////////////////////////////////////////////////////

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
