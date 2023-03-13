import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { HomeComponent } from "../home/home.component";
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { ReportsComponent } from "../reports/reports.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
// import { A11yModule } from "@angular/cdk/a11y";
// import { DragDropModule } from "@angular/cdk/drag-drop";
// import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
// import { CdkTreeModule } from "@angular/cdk/tree";
// import { MatAutocompleteModule } from "@angular/material/autocomplete";
// import { MatBadgeModule } from "@angular/material/badge";
// import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
// import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
// import { MatChipsModule } from "@angular/material/chips";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
// import { MatDividerModule } from "@angular/material/divider";
// import { MatExpansionModule } from "@angular/material/expansion";
// import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
// import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
// import { MatSidenavModule } from "@angular/material/sidenav";
// import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
// import { MatSnackBarModule } from "@angular/material/snack-bar";
// import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
// import { MatToolbarModule } from "@angular/material/toolbar";
// import { MatTreeModule } from "@angular/material/tree";
import { MyRequestsComponent } from "app/myRequests/my_requests.component";
import { MyPropertiesComponent } from "app/myProperties/my_properties.component";
import { AppointmentsComponent } from "app/appointments/appointments.component";
import { DocumentsComponent } from "app/documents/documents.component";
import { NewPaymentComponent } from "app/new_payment/new_payment.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import { ModalComponentDate } from "app/appointments/show_modal_date/modal-date";
import { ModalComponent } from "app/appointments/show_model_event/modal";
import { FM_MaintananceRequest } from "app/indus_services/facility_management/fm-maintanence_request/fm-maintanence_request.component";
import { Tenant_Move_out_Request } from "app/indus_services/facility_management/tenant_move-out_request/tenant_move-out_request.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";
import { AddPropertyForm } from "app/add-property-form/add_property_from";
import { NgxCheckboxModule } from "ngx-checkbox";
import { AdminRequests } from "app/admin-requests/admin-requests";
import { PropertyPage } from "app/property-page/property-page.component";
// import { GoogleMapsModule } from "@angular/google-maps";
// import { NgApexchartsModule } from "ng-apexcharts";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { AcceptRequestConfirmDialog } from "app/admin-requests/accept_req_dialog/acspt_req_dialog";
import { HttpClientModule } from "@angular/common/http";
import { DeclineRequestConfirmDialog } from "app/admin-requests/decline_req_dialog/decline_req_dialog";
import { LoginComponent } from "app/login/login.component";
import { RegisterComponent } from "app/register/register.component";
import { LandlordFormComponent } from "app/landlord_register_form/landlord_form.component";
import { TenantRegisterComponent } from "app/indus_services/facility_management/tenant_register_form/tenant_form.component";
import { StepperLandlordRegisterFirst } from "app/landlord_register_form/components/stepper_01_reg_landlord/stepper_first_reg_landlord";
import { StepperLandlordRegisterSecond } from "app/landlord_register_form/components/stepper_02_reg_landlord/stepper_second_reg_landlord";
import { StepperLandlordRegisterThird } from "app/landlord_register_form/components/stepper_03_reg_landlord/stepper_third_reg_landlord";
import { StepperTenantRegisterFirst } from "app/indus_services/facility_management/tenant_register_form/components/stepper_01_reg_tenant/stepper_first_reg_tenant";
import { StepperTenantRegisterSecond } from "app/indus_services/facility_management/tenant_register_form/components/stepper_02_reg_tenant/stepper_second_reg_tenant";
import { StepperTenantRegisterThird } from "app/indus_services/facility_management/tenant_register_form/components/stepper_03_reg_tenant/stepper_third_reg_tenant";
import { CountryDropdown } from "app/components/country-dropdown/country-dropdown";
import { RequestPage } from "app/request-page/request-page";
import { BackButtonDirective } from "app/request-page/back-navigation.directive";
import { AdminLandlordClients } from "app/admin_landlord_clients/admin_landlord_clients";
import { AdminTenantClients } from "app/admin_tenant_clients/admin_tenant_clients";
import { AdminSaleProperties } from "app/admin_sale_properties/admin_sale_properties";
import { AdminRentProperties } from "app/admin_rent_properties/admin_rent_properties";
import { CustomerCareComponent } from "app/indus_services/customer_service/customer_care";
import { Tenant_Move_in_Request } from "app/indus_services/facility_management/tenant_move-in_request/tenant_move-in_request";
import { PaymentRecapComponent } from "app/payment_recap/payment_recap";

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
    // MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    // A11yModule,
    // DragDropModule,
    // PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    // CdkTreeModule,
    // MatAutocompleteModule,
    // MatBadgeModule,
    // MatBottomSheetModule,
    // MatButtonToggleModule,
    MatCheckboxModule,
    // MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    // MatDividerModule,
    // MatExpansionModule,
    // MatGridListModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    // MatProgressSpinnerModule,
    MatRadioModule,
    // MatSidenavModule,
    // MatSliderModule,
    MatSlideToggleModule,
    // MatSnackBarModule,
    // MatSortModule,
    MatTableModule,
    MatTabsModule,
    // MatToolbarModule,
    // MatTreeModule,
    MatNativeDateModule,
    FullCalendarModule,
    NgxSkeletonLoaderModule,
    NgxCheckboxModule,
    // GoogleMapsModule,
    // NgApexchartsModule,
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
    
    NewPaymentComponent,
    FM_MaintananceRequest,
    Tenant_Move_out_Request,
    Tenant_Move_in_Request,

    AcceptRequestConfirmDialog,
    DeclineRequestConfirmDialog,

    LoginComponent,
    RegisterComponent,
    LandlordFormComponent,
    TenantRegisterComponent,

    // Landlord Reg
    StepperLandlordRegisterFirst,
    StepperLandlordRegisterSecond,
    StepperLandlordRegisterThird,

    // Tenant Reg
    StepperTenantRegisterFirst,
    StepperTenantRegisterSecond,
    StepperTenantRegisterThird,

    AdminLandlordClients,
    AdminTenantClients,
    AdminSaleProperties,
    AdminRentProperties,

    CountryDropdown,
    RequestPage,
    BackButtonDirective,
    CustomerCareComponent,
    PaymentRecapComponent
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AdminLayoutModule {}
