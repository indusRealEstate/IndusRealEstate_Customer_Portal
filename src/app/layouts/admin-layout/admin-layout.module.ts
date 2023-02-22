import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { HomeComponent } from "../../home/home.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { ReportsComponent } from "../../reports/reports.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { A11yModule } from "@angular/cdk/a11y";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTreeModule } from "@angular/material/tree";
import { MyRequestsComponent } from "app/myRequests/my_requests.component";
import { MyPropertiesComponent } from "app/myProperties/my_properties.component";
import { AppointmentsComponent } from "app/appointments/appointments.component";
import { DocumentsComponent } from "app/documents/documents.component";
import { NewPaymentComponent } from "app/new_payment/new_payment.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import { StepperFirstComponent } from "app/new_payment/components/stepper_01/stepper_first";
import { StepperSecondComponent } from "app/new_payment/components/stepper_02/stepper_second";
import { StepperThirdComponent } from "app/new_payment/components/stepper_03/stepper_third";
import { StepperFourthComponent } from "app/new_payment/components/stepper_04/stepper_fourth";
import { StepperFifthComponent } from "app/new_payment/components/stepper_05/stepper_fifth";
import { StepperSixthComponent } from "app/new_payment/components/stepper_06/stepper_sixth";
import { ModalComponentDate } from "app/appointments/show_modal_date/modal-date";
import { ModalComponent } from "app/appointments/show_model_event/modal";
import { FM_MaintananceRequest } from "app/indus_services/facility_management/fm-maintanence_request/fm-maintanence_request.component";
import { FM_MaintananceRequest_Stepper_First } from "app/indus_services/facility_management/fm-maintanence_request/components/stepper_01/fm-maintanence-first";
import { FM_MaintananceRequest_Stepper_Second } from "app/indus_services/facility_management/fm-maintanence_request/components/stepper_02/fm-maintanence-second";
import { FM_MaintananceRequest_Stepper_Third } from "app/indus_services/facility_management/fm-maintanence_request/components/stepper_03/fm-maintanence-third";
import { FM_MaintananceRequest_Stepper_Fourth } from "app/indus_services/facility_management/fm-maintanence_request/components/stepper_04/fm-maintanence-fourth";
import { FM_MaintananceRequest_Stepper_Fifth } from "app/indus_services/facility_management/fm-maintanence_request/components/stepper_05/fm-maintanence-fifth";
import { FM_MaintananceRequest_Stepper_Sixth } from "app/indus_services/facility_management/fm-maintanence_request/components/stepper_06/fm-maintanence-sixth";
import { Owner_Move_in_Request } from "app/indus_services/facility_management/owner_move-in_request/owner_move-in_request.component";
import { Owner_Move_in_Request_Stepper_First } from "app/indus_services/facility_management/owner_move-in_request/components/stepper_01/owner_move-in_request-first";
import { Owner_Move_in_Request_Stepper_Second } from "app/indus_services/facility_management/owner_move-in_request/components/stepper_02/owner_move-in_request-second";
import { Owner_Move_in_Request_Stepper_Third } from "app/indus_services/facility_management/owner_move-in_request/components/stepper_03/owner_move-in_request-third";
import { Owner_Move_in_Request_Stepper_Fourth } from "app/indus_services/facility_management/owner_move-in_request/components/stepper_04/owner_move-in_request-fourth";
import { Owner_Move_in_Request_Stepper_Fifth } from "app/indus_services/facility_management/owner_move-in_request/components/stepper_05/owner_move-in_request-fifth";
import { Owner_Move_in_Request_Stepper_Sixth } from "app/indus_services/facility_management/owner_move-in_request/components/stepper_06/owner_move-in_request-sixth";
import { Owner_Move_out_Request } from "app/indus_services/facility_management/owner_move-out_request/owner_move-out_request.component";
import { Owner_Move_out_Request_Stepper_First } from "app/indus_services/facility_management/owner_move-out_request/components/stepper_01/owner_move-out_request-first";
import { Owner_Move_out_Request_Stepper_Second } from "app/indus_services/facility_management/owner_move-out_request/components/stepper_02/owner_move-out_request-second";
import { Owner_Move_out_Request_Stepper_Third } from "app/indus_services/facility_management/owner_move-out_request/components/stepper_03/owner_move-out_request-third";
import { Owner_Move_out_Request_Stepper_Fourth } from "app/indus_services/facility_management/owner_move-out_request/components/stepper_04/owner_move-out_request-fourth";
import { Owner_Move_out_Request_Stepper_Fifth } from "app/indus_services/facility_management/owner_move-out_request/components/stepper_05/owner_move-out_request-fifth";
import { Owner_Move_out_Request_Stepper_Sixth } from "app/indus_services/facility_management/owner_move-out_request/components/stepper_06/owner_move-out_request-sixth";
import { Tenant_Move_out_Request } from "app/indus_services/facility_management/tenant_move-out_request/tenant_move-out_request.component";
import { Tenant_Move_out_Request_Stepper_First } from "app/indus_services/facility_management/tenant_move-out_request/components/stepper_01/tenant_move-out_request-first";
import { Tenant_Move_out_Request_Stepper_Second } from "app/indus_services/facility_management/tenant_move-out_request/components/stepper_02/tenant_move-out_request-second";
import { Tenant_Move_out_Request_Stepper_Third } from "app/indus_services/facility_management/tenant_move-out_request/components/stepper_03/tenant_move-out_request-third";
import { Tenant_Move_out_Request_Stepper_Fourth } from "app/indus_services/facility_management/tenant_move-out_request/components/stepper_04/tenant_move-out_request-fourth";
import { Tenant_Move_out_Request_Stepper_Fifth } from "app/indus_services/facility_management/tenant_move-out_request/components/stepper_05/tenant_move-out_request-fifth";
import { Tenant_Move_out_Request_Stepper_Sixth } from "app/indus_services/facility_management/tenant_move-out_request/components/stepper_06/tenant_move-out_request-sixth";
import { Tenant_Registration } from "app/indus_services/facility_management/tenant_registration/tenant_registration.component";
import { Tenant_Registration_Stepper_First } from "app/indus_services/facility_management/tenant_registration/components/stepper_01/tenant_registration-first";
import { Tenant_Registration_Stepper_Second } from "app/indus_services/facility_management/tenant_registration/components/stepper_02/tenant_registration-second";
import { Tenant_Registration_Stepper_Third } from "app/indus_services/facility_management/tenant_registration/components/stepper_03/tenant_registration-third";
import { Tenant_Registration_Stepper_Fourth } from "app/indus_services/facility_management/tenant_registration/components/stepper_04/tenant_registration-fourth";
import { Tenant_Registration_Stepper_Fifth } from "app/indus_services/facility_management/tenant_registration/components/stepper_05/tenant_registration-fifth";
import { Tenant_Registration_Stepper_Sixth } from "app/indus_services/facility_management/tenant_registration/components/stepper_06/tenant_registration-sixth";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";
import { AddPropertyForm } from "app/add-property-form/add_property_from";
import { NgxCheckboxModule } from "ngx-checkbox";
import { AdminRequests } from "app/admin-requests/admin-requests";
import { PropertyPage } from "app/property-page/property-page.component";
import { GoogleMapsModule } from "@angular/google-maps";
import { NgApexchartsModule } from "ng-apexcharts";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { AcceptRequestConfirmDialog } from "app/admin-requests/accept_req_dialog/acspt_req_dialog";
import { HttpClientModule } from "@angular/common/http";

// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    A11yModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTreeModule,
    MatNativeDateModule,
    FullCalendarModule,
    NgxSkeletonLoaderModule,
    NgxCheckboxModule,
    GoogleMapsModule,
    NgApexchartsModule,
    // NgbModalModule,
    // FlatpickrModule.forRoot(),
    // BrowserModule,
    // BrowserAnimationsModule,
  ],
  declarations: [
    HomeComponent,
    UserProfileComponent,
    ReportsComponent,
    MyRequestsComponent,
    MyPropertiesComponent,
    AppointmentsComponent,
    DocumentsComponent,
    PageNotFoundComponent,
    PropertyPage,
    AddPropertyForm,
    AdminRequests,
    AdminDashboardComponent,

    ModalComponent,
    ModalComponentDate,

    // cdk steps components for new payments
    NewPaymentComponent,
    StepperFirstComponent,
    StepperSecondComponent,
    StepperThirdComponent,
    StepperFourthComponent,
    StepperFifthComponent,
    StepperSixthComponent,

    // cdk steps components for fm maintanence request
    FM_MaintananceRequest,
    FM_MaintananceRequest_Stepper_First,
    FM_MaintananceRequest_Stepper_Second,
    FM_MaintananceRequest_Stepper_Third,
    FM_MaintananceRequest_Stepper_Fourth,
    FM_MaintananceRequest_Stepper_Fifth,
    FM_MaintananceRequest_Stepper_Sixth,

    // cdk steps components for owner move-in request
    Owner_Move_in_Request,
    Owner_Move_in_Request_Stepper_First,
    Owner_Move_in_Request_Stepper_Second,
    Owner_Move_in_Request_Stepper_Third,
    Owner_Move_in_Request_Stepper_Fourth,
    Owner_Move_in_Request_Stepper_Fifth,
    Owner_Move_in_Request_Stepper_Sixth,

    // cdk steps components for owner move-in request
    Owner_Move_out_Request,
    Owner_Move_out_Request_Stepper_First,
    Owner_Move_out_Request_Stepper_Second,
    Owner_Move_out_Request_Stepper_Third,
    Owner_Move_out_Request_Stepper_Fourth,
    Owner_Move_out_Request_Stepper_Fifth,
    Owner_Move_out_Request_Stepper_Sixth,

    // cdk steps components for tenant move-in request
    Tenant_Move_out_Request,
    Tenant_Move_out_Request_Stepper_First,
    Tenant_Move_out_Request_Stepper_Second,
    Tenant_Move_out_Request_Stepper_Third,
    Tenant_Move_out_Request_Stepper_Fourth,
    Tenant_Move_out_Request_Stepper_Fifth,
    Tenant_Move_out_Request_Stepper_Sixth,

    // cdk steps components for tenant registration
    Tenant_Registration,
    Tenant_Registration_Stepper_First,
    Tenant_Registration_Stepper_Second,
    Tenant_Registration_Stepper_Third,
    Tenant_Registration_Stepper_Fourth,
    Tenant_Registration_Stepper_Fifth,
    Tenant_Registration_Stepper_Sixth,

    AcceptRequestConfirmDialog,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AdminLayoutModule {}
