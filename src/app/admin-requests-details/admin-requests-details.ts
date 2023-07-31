import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "property-details",
  templateUrl: "./admin-requests-details.html",
  styleUrls: ["./admin-requests-details.scss"],
})
export class AdminRequestsDetails implements OnInit {
  isUserSignedIn: boolean = false;
  prop_id: string;
  request_id:string;
  request_data: object | any;
  image_array: string[] = [];
  images: string;
  documents: string;
  doc_array: string[] = [];
  d1: string;
  blob: Blob;
  isContentLoading: boolean = false;
  //downloadService: any;
  // property_name:string;

  constructor(
    private router: Router,
    private appAdminService: AdminService,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private appdownloadService: DownloadService,
    public http: HttpClient
  ) {
    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.route.queryParams.subscribe((val) => {
      // console.log(val);
      this.request_id = val.request_id;
    }).add(()=>{
      this.isContentLoading = false;
    });

    // this.route.queryParams.subscribe((e) => {
    //   if (e == null) {
    //     router.navigate([`/property-details`], {
    //       queryParams: { uid: user[0]["id"] },
    //     });
    //   } else if (e != user[0]["id"]) {
    //     router.navigate([`/property-details`], {
    //       queryParams: { uid: user[0]["id"] },
    //     });
    //   }
    // });

    
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngAfterViewInit() {}

  async ngOnInit() {
    

    let data = {
      request_id: this.request_id,
      requestdata: this.request_data
    };
    this.appAdminService.getRequestsDetails(JSON.stringify(data)).subscribe((val) => {
         //console.log(data);
         let resultdata = val;
         console.log(resultdata);
        //  SELECT * FROM `maintenance_requests` INNER JOIN properties WHERE maintenance_requests.property_id = properties.property_id
        // SELECT * FROM `maintenance_requests` INNER JOIN properties ON  maintenance_requests.property_id =  properties.property_id 
        // INNER JOIN  properties_units ON  properties_units.unit_id=maintenance_requests.unit_id
    
        
        // this.images = this.prop_data.images;

        //  this.property_name = this.prop_data.property_name;
      });
  }
  

  
}
