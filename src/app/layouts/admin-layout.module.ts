import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
  NgOptimizedImage,
} from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { ReportsComponent } from "../reports/reports.component";
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { AdminLayoutRoutes } from "./admin-layout.routing";
// import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
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
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatStepperModule } from "@angular/material/stepper";
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
import { FullCalendarModule } from "@fullcalendar/angular";
import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";
import { AddPropertyForm } from "app/add-property-form/add_property_from";
import { MyPropertiesComponent } from "app/myProperties/my_properties.component";
import { NgxCheckboxModule } from "ngx-checkbox";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
// import { AdminRequests } from "app/admin-requests/admin-requests";
import { PropertyPage } from "app/property-page/property-page.component";
// import { GoogleMapsModule } from "@angular/google-maps";
// import { NgApexchartsModule } from "ng-apexcharts";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from "@angular/common/http";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AdminAllLandlordClients } from "app/admin-all-landlord-clients/admin-all-landlord-clients";
import { AdminAllTenantClients } from "app/admin-all-tenants-clients/admin-all-tenants-clients";
import { ReviewRequestAdmin } from "app/admin-request-review-page/admin-request-review-page";
import { AdminRequestsArchive } from "app/admin-requests-archive/admin-requests-archive";
import { AdminReqsLandlord } from "app/admin-requests-landlord/admin-req-landlord";
import { AdminRequestsSpam } from "app/admin-requests-spam/admin-requests-spam";
import { AdminReqsTenant } from "app/admin-requests-tenant/admin-req-tenant";
import { AdminReqs } from "app/admin-requests/admin-requests";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { AdminPropertiesRent } from "app/admin_properties_rent/admin_properties_rent";
import { AdminPropertiesSale } from "app/admin_properties_sale/admin_properties_sale";
import { BackButtonDirective } from "app/components/back-navigation.directive";
import { CountryDropdown } from "app/components/country-dropdown/country-dropdown";
import { LoadingTableAdminCLients } from "app/components/loading-table-admin-clients/loading-table-admin-clients";
import { LoadingTableAdminReqs } from "app/components/loading-table-admin-reqs/loading-table-admin-reqs";
import { LoadingTableTenantReqs } from "app/components/loading-table-tenant-reqs/loading-table-tenant-reqs";
import { RequestTimelineComponent } from "app/components/request-timeline/request-timeline";
import { ReviewRequestDialog } from "app/components/review_req_dialog/review_req_dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AllClientsDocuments } from "app/documents/all-clients-docs/all-clients-docs";
import { IndividualDocumentsComponent } from "app/documents/individual-docs/individual-docs";
import { DocumentsComponentMyDoc } from "app/documents/my-documents/my-docs";
import { DocumentsComponentMyTenantDoc } from "app/documents/my-tenant-documents/my-tenant-docs";
import { CustomerCareComponent } from "app/indus_services/customer_service/customer_care";
import { ServiceRecapComponent } from "app/indus_services/facility_management/service_recap/service_recap";
import { ServiceTemplateComponent } from "app/indus_services/facility_management/service_template/service_template";
import { StepperTenantRegisterFirst } from "app/indus_services/facility_management/tenant_register_form/components/stepper_01_reg_tenant/stepper_first_reg_tenant";
import { StepperTenantRegisterSecond } from "app/indus_services/facility_management/tenant_register_form/components/stepper_02_reg_tenant/stepper_second_reg_tenant";
import { StepperTenantRegisterThird } from "app/indus_services/facility_management/tenant_register_form/components/stepper_03_reg_tenant/stepper_third_reg_tenant";
import { TenantRegisterComponent } from "app/indus_services/facility_management/tenant_register_form/tenant_form.component";
import { StepperLandlordRegisterFirst } from "app/landlord_register_form/components/stepper_01_reg_landlord/stepper_first_reg_landlord";
import { StepperLandlordRegisterSecond } from "app/landlord_register_form/components/stepper_02_reg_landlord/stepper_second_reg_landlord";
import { StepperLandlordRegisterThird } from "app/landlord_register_form/components/stepper_03_reg_landlord/stepper_third_reg_landlord";
import { LandlordFormComponent } from "app/landlord_register_form/landlord_form.component";
import { LoginComponent } from "app/login/login.component";
import { MyLandlordComponent } from "app/my-landlord/my-landlord";
import { MyTenantsLandlord } from "app/my-tenants/my-tenants";
import { NotificationsPage } from "app/notifications-page/notifications-page";
import { RegisterComponent } from "app/register/register.component";
import { RequestsComponentInspection } from "app/requests/landlord-requests/inspection/inspection-req";
import { RequestsComponentMyReqs } from "app/requests/my-requests/my-reqs";
import { RequestsComponentPayment } from "app/requests/payment/payment-req";
import { RequestsComponentConditioning } from "app/requests/tenant-requests/conditoning/conditioning-req";
import { RequestsComponentMaintenance } from "app/requests/tenant-requests/maintenance/maintenance-req";
import { RequestsComponentTenantMoveIn } from "app/requests/tenant-requests/tenant-move-in/tenant-move-in-req";
import { RequestsComponentTenantMoveOut } from "app/requests/tenant-requests/tenant-move-out/tenant-move-out-req";
import { UserChatsComponent } from "app/user_chats/user_chats";
import { ClipboardModule } from "@angular/cdk/clipboard";

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
    DragDropModule,
    NgOptimizedImage,
    ClipboardModule,
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
    RequestsComponentMyReqs,
    RequestsComponentPayment,
    RequestsComponentConditioning,
    RequestsComponentMaintenance,
    RequestsComponentTenantMoveIn,
    RequestsComponentTenantMoveOut,
    MyPropertiesComponent,
    DocumentsComponentMyDoc,
    DocumentsComponentMyTenantDoc,
    PageNotFoundComponent,
    PropertyPage,
    AddPropertyForm,
    // AdminRequests,
    AdminReqs,
    AdminReqsLandlord,
    AdminReqsTenant,
    AdminRequestsArchive,
    AdminRequestsSpam,
    AdminDashboardComponent,

    ReviewRequestDialog,

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
    AdminPropertiesRent,
    AdminPropertiesSale,

    CountryDropdown,
    CustomerCareComponent,
    ServiceTemplateComponent,
    ServiceRecapComponent,
    NotificationsPage,
    IndividualDocumentsComponent,
    MyTenantsLandlord,
    MyLandlordComponent,
    AllClientsDocuments,
    RequestsComponentInspection,
    TableSearchBarComponent,
    TableFiltersComponent,
    RequestTimelineComponent,
    ReviewRequestAdmin,
    LoadingTableTenantReqs,
    LoadingTableAdminReqs,
    LoadingTableAdminCLients,
    AdminAllLandlordClients,
    AdminAllTenantClients,
    UserChatsComponent,

    BackButtonDirective,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AdminLayoutModule {}
