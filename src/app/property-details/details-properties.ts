import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "property-details",
  templateUrl: "./details-properties.html",
  styleUrls: ["./details-properties.scss"],
})
export class DetailsComponents implements OnInit {
  isUserSignedIn: boolean = false;
  prop_id: string;
  prop_data: object | any;
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
      this.prop_id = val.prop_id;
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
      prop_id: this.prop_id,
    };
    this.appAdminService
      .getPropDetails(JSON.stringify(data))
      .subscribe((val) => {
        // console.log(val);
        this.prop_data = val;

        this.images = this.prop_data.images;
        this.documents = this.prop_data.documents;
        //  this.property_name = this.prop_data.property_name;
        // console.log(this.prop_data.images);
        for (let i = 0; i < JSON.parse(this.prop_data.images).length; i++) {
          let image = JSON.parse(this.prop_data.images)[i];
          //console.log(image);
          this.image_array.push(image);
        }

        $(document).ready(() => {
          console.log('hello');
          console.log(this.prop_data);
         for (let i = 0; i < this.image_array.length; i++) {
          
           let carousel = document.getElementById("carousel");
           if (i == 0) {
             let carouselDiv = document.createElement("div");
             carouselDiv.classList.add("carousel-item");
             carouselDiv.classList.add("active");
             carousel.append(carouselDiv);
   
             let imgElmnt = document.createElement("img");
             imgElmnt.classList.add("d-block");
             imgElmnt.classList.add("w-100");
             imgElmnt.classList.add("rounded");
             imgElmnt.style.height = "50vh";
             imgElmnt.style.objectFit = "cover";
             imgElmnt.style.objectPosition = "bottom";
             imgElmnt.src = `https://www.indusre.app/api/upload/property/${this.prop_id}/images/${this.image_array[i]}`;
             carouselDiv.append(imgElmnt);
           } else {
             let carouselDiv = document.createElement("div");
             carouselDiv.classList.add("carousel-item");
             carousel.append(carouselDiv);
   
             let imgElmnt = document.createElement("img");
             imgElmnt.classList.add("d-block");
             imgElmnt.classList.add("w-100");
             imgElmnt.classList.add("rounded");
             imgElmnt.style.height = "50vh";
             imgElmnt.style.objectFit = "cover";
             imgElmnt.style.objectPosition = "bottom";
             imgElmnt.src = `https://www.indusre.app/api/upload/property/${this.prop_id}/images/${this.image_array[i]}`;
             carouselDiv.append(imgElmnt);
           }
         }
         console.log(this.image_array);
       });


        console.log(this.prop_data);
        for (let i = 0; i < JSON.parse(this.prop_data.documents).length; i++) {
          let documents = JSON.parse(this.prop_data.documents)[i];
          //console.log(image);
          this.doc_array.push(documents);
          // console.log(this.doc_array[i]);
        }

        
        //console.log(this.prop_data);
      });
  }
  // downloadFile(file_name: any) {
  //   //console.log(data);
  //   const file_url = `https://indusre.app/api/upload/property/${this.prop_id}/${file_name}`;

  //   // let headers = new Headers({
  //   //   "Content-Type": "application/json",
  //   // "Access-Control-Allow-Origin" :"http://localhost:4200",
  //   //   "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE",
  //   //   Accept: "application/*", //give file extension
  //   // });
  //   // let options = { headers: headers };
  //    const req = this.http.post(file_url, { responseType: "blob" });

  //   req.subscribe((file: Blob) => {
  //     const blob = new Blob([file_url], { type: "pdf/docx" });
  //     const url = window.URL.createObjectURL(blob);
  //     window.open(url);
  //   });
  // }

  downloadDoc(data: any) {
    //console.log(data);
    let object = {
      id: this.prop_data.property_id,
      data: data,
    };

    this.appAdminService
      .getDownloadDocument(JSON.stringify(object))
      .subscribe((val) => {
        //this.downloadFile(data);
        // .subscribe((val) => {
        console.log(data);
      });
  }

  downloadFile(property_id: string, file_name: string) {
   
    const url = `https://indusre.app/api/upload/property/${property_id}/documents/${file_name}`;

    this.appdownloadService.download(url).subscribe((blob) => {
      const a = document.createElement("a");
      console.log(a);
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = file_name;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
