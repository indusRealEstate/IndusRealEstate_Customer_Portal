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

  public userSignedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

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

  public convertToBase64(input: string) {
    let base64EncodedString = window.btoa(input);
    return encodeURIComponent(base64EncodedString);
  }

  // public convertFileToBase64(file) {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function () {
  //     console.log(reader.result);
  //     return reader.result;
  //   };
  //   reader.onerror = function (error) {
  //     console.log("Error: ", error);
  //   };
  // }

  public array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  public decodeBase64(input: string) {
    var type_1 = decodeURIComponent(input);
    return window.atob(type_1);
  }

  public generateRandomID() {
    return Math.floor(10000000000000 + Math.random() * 90000000000000);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  public formatBytes(bytes, decimals?) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  public convertDateToServerFormat(date: Date) {
    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]);
    var convertedDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    return convertedDate;
  }
}
