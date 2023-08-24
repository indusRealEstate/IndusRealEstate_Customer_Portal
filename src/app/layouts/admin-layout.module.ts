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
import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
// import { AdminRequests } from "app/admin-requests/admin-requests";
// import { GoogleMapsModule } from "@angular/google-maps";
// import { NgApexchartsModule } from "ng-apexcharts";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from "@angular/common/http";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AdminPropertiesUnits } from "app/admin-properties-units/admin-properties-units";
import { AdminProperties } from "app/admin-properties/admin-properties";
import { AdminPropertiesUnitDetails } from "app/admin-property-unit-details/admin-property-unit-details";
import { AdminReport } from "app/admin-report/admin-report";
import { ReviewRequestAdmin } from "app/admin-request-review-page/admin-request-review-page";
import { AdminRequestsArchive } from "app/admin-requests-archive/admin-requests-archive";
import { AdminRequestsDetails } from "app/admin-requests-details/admin-requests-details";
import { AdminRequestsSpam } from "app/admin-requests-spam/admin-requests-spam";
import { AdminRequests } from "app/admin-requests/admin-requests";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { AllUsersComponent } from "app/all-users/all-users";
import { BackButtonDirective } from "app/components/back-navigation.directive";
import { LoadingTableAdminAllUsers } from "app/components/loading-table-admin-all-users/loading-table-admin-all-users";
import { LoadingTableAdminPropertiesUnits } from "app/components/loading-table-admin-properties-units/loading-table-admin-properties-units";
import { LoadingTableAdminProperties } from "app/components/loading-table-admin-properties/loading-table-admin-properties";
import { LoadingTableAdminReqs } from "app/components/loading-table-admin-reqs/loading-table-admin-reqs";
import { LoadingTableAnnouncement } from "app/components/loading-table-announcement/loading-table-announcement";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { ViewIncomeStatementDialog } from "app/components/view-income-statement-dialog/view-income-statement-dialog";
import { AllClientsDocuments } from "app/documents/all-clients-docs/all-clients-docs";
import { IndividualDocumentsComponent } from "app/documents/individual-docs/individual-docs";
import { LoginComponent } from "app/login/login.component";
import { DetailsComponents } from "app/property-details/details-properties";
import { UserChatsComponent } from "app/user_chats/user_chats";

// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';``
import { ChartsModule } from "@progress/kendo-angular-charts";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AdminLeaseDetail } from "app/admin-lease-details/admin-lease-details";
import { AllLeasesComponent } from "app/admin-lease/admin-lease";
import { RequestsTable } from "app/admin-requests/components/requests-table/requests-table";
import { ViewUserDetails } from "app/admin-user-details/admin-user-details";
import { Announcements } from "app/announcements/announcements";
import { AddAnnouncementDialog } from "app/components/add-announcement-dialog/add-announcement-dialog";
import { DialogAssignStaff } from "app/components/assign_staff/assign_staff";
import { EditAnnouncementDialog } from "app/components/edit_announcement_dialog/edit_announcement_dialog";
import { LoadingTableAdminAllLease } from "app/components/loading-table-admin-all-lease/loading-table-admin-all-lease";
import { ViewMaintenanceImageDialog } from "app/components/view-maintenance-image-dialog/view-maintenance-image-dialog";
import { ViewAssignStaff } from "app/components/view_assign_sttaf/view_assign_sttaf";
import "hammerjs";

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
    MatSnackBarModule,
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
    NgxSkeletonLoaderModule,
    DragDropModule,
    NgOptimizedImage,
    ChartsModule,

    // GoogleMapsModule,
    // NgApexchartsModule,
    // NgbModalModule,
    // FlatpickrModule.forRoot(),
    // BrowserModule,
    // BrowserAnimationsModule,
  ],
  declarations: [
    PageNotFoundComponent,
    // AdminRequests,
    AdminRequests,
    AdminRequestsArchive,
    AdminRequestsSpam,
    AdminDashboardComponent,
    ViewMaintenanceImageDialog,
    // all request components
    RequestsTable,
    ViewAssignStaff,
    DialogAssignStaff,
    AdminReport,
    AddAnnouncementDialog,
    LoginComponent,
    AdminProperties,
    DetailsComponents,
    ViewIncomeStatementDialog,
    AdminRequestsDetails,
    AdminPropertiesUnits,
    AdminPropertiesUnitDetails,
    ViewUserDetails,
    AdminLeaseDetail,
    IndividualDocumentsComponent,
    AllClientsDocuments,
    TableSearchBarComponent,
    TableFiltersComponent,
    ReviewRequestAdmin,
    LoadingTableAdminReqs,
    LoadingTableAdminProperties,
    LoadingTableAdminPropertiesUnits,
    LoadingTableAdminAllUsers,
    LoadingTableAdminAllLease,
    LoadingTableAnnouncement,
    UserChatsComponent,
    EditAnnouncementDialog,
    AllUsersComponent,
    BackButtonDirective,
    AllLeasesComponent,
    Announcements,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AdminLayoutModule {}
