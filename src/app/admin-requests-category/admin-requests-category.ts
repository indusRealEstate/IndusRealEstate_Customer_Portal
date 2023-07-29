import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AddCategoryDialog } from "app/components/add_category_dialog/add_category_dialog";
import { EditCategoryDialog } from "app/components/edit_category_dialog/edit_category_dialog";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";

@Component({
  selector: "admin-requests-spam",
  templateUrl: "./admin-requests-category.html",
  styleUrls: ["./admin-requests-category.scss"],
})
export class AdminRequestsCategory implements OnInit {
  isUserSignedIn: boolean = false;
  categoryData: object;
  main_array: any[];
  msg: string;
  item_deleted: boolean = false;
  display_msg: boolean = false;
  is_active : boolean = false;

  // @ViewChild(AddCategoryDialog) category_dialog!: AddCategoryDialog;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    public dialog: MatDialog,
    private apiAdminService: AdminService
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate([`/admin-request-category`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/admin-request-category`], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])

  getDataFromChild(value:boolean){
    console.log(value);
  }
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

  openWindow() {
    this.dialog.open(AddCategoryDialog, {
      data: {
        category_name: "sample",
        icon: "sample_icon",
      },
    }).afterClosed().subscribe((val)=>{
      this.selectAllCategories()
    });
  }

  ngAfterViewInit() {}

  selectAllCategories():any{
    this.apiAdminService.selecteCategory().subscribe((val) => {
      this.categoryData = val;
    });

    return this.categoryData;
  }

  async ngOnInit() {
    this.selectAllCategories()
    // console.log(this.category_dialog.form_submit);
  }

  // delete_item(data:any){
  //   this.display_msg = true
  //   this.apiAdminService.deleteServiceCategory(data).subscribe((value:any)=>{
  //     if(value.status == 1){
  //       this.msg = value.msg;
  //       this.item_deleted = true;
  //       this.selectAllCategories()
  //     }
  //     else{
  //       this.msg = value.msg;
  //       this.item_deleted = false;
  //     }
  //   })
  //   setTimeout(()=>{
  //     this.display_msg = false;
  //   },2000)
  // }

  // stauts_change(event,id){
  //   // console.log(event.checked);

  //   let status = (event.checked == true) ? 1 : 0;
  //   let data = {
  //     "status" : status,
  //     "id" : id
  //   }
  //   let json_format = JSON.stringify(data);

  //   this.apiAdminService.changeCategoryStatus(json_format).subscribe((value:any)=>{
  //     // console.log(value);
  //     this.selectAllCategories()
  //   })

  // }

  // edit_item(data:any){

  //   this.dialog.open(EditCategoryDialog, {
  //     data
  //   }).afterClosed().subscribe((val)=>{
  //     this.selectAllCategories()
  //   });
  // }

  viewCategory(data:any){
    this.dialog.open(EditCategoryDialog, {
      data
    }).afterClosed().subscribe((val)=>{
      this.selectAllCategories()
    });
  }
}
