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
import { AddPropertyForm } from "app/add-property-form/add_property_from";
import { NgxCheckboxModule } from "ngx-checkbox";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
// import { AdminRequests } from "app/admin-requests/admin-requests";
// import { GoogleMapsModule } from "@angular/google-maps";
// import { NgApexchartsModule } from "ng-apexcharts";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from "@angular/common/http";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AdminAllLandlordClients } from "app/admin-all-landlord-clients/admin-all-landlord-clients";
import { AdminAllTenantClients } from "app/admin-all-tenants-clients/admin-all-tenants-clients";
import { ReviewRequestAdmin } from "app/admin-request-review-page/admin-request-review-page";
import { AdminRequestsArchive } from "app/admin-requests-archive/admin-requests-archive";
import { AdminRequestsSpam } from "app/admin-requests-spam/admin-requests-spam";
import { AdminReqs } from "app/admin-requests/admin-requests";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { BackButtonDirective } from "app/components/back-navigation.directive";
import { CountryDropdown } from "app/components/country-dropdown/country-dropdown";
import { LoadingTableAdminCLients } from "app/components/loading-table-admin-clients/loading-table-admin-clients";
import { LoadingTableAdminReqs } from "app/components/loading-table-admin-reqs/loading-table-admin-reqs";
import { RequestTimelineComponent } from "app/components/request-timeline/request-timeline";
import { ReviewRequestDialog } from "app/components/review_req_dialog/review_req_dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AllClientsDocuments } from "app/documents/all-clients-docs/all-clients-docs";
import { IndividualDocumentsComponent } from "app/documents/individual-docs/individual-docs";
import { LoginComponent } from "app/login/login.component";
import { UserChatsComponent } from "app/user_chats/user_chats";
import { MatTimepickerModule } from "mat-timepicker";
import { AdminProperties } from "app/admin-properties/admin-properties";
import { LoadingTableAdminProperties } from "app/components/loading-table-admin-properties/loading-table-admin-properties";
import { AdminPropertiesUnits } from "app/admin-properties-units/admin-properties-units";
import { LoadingTableAdminPropertiesUnits } from "app/components/loading-table-admin-properties-units/loading-table-admin-properties-units";

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
    NgxSkeletonLoaderModule,
    NgxCheckboxModule,
    DragDropModule,
    NgOptimizedImage,
    ClipboardModule,
    MatTimepickerModule,
    // GoogleMapsModule,
    // NgApexchartsModule,
    // NgbModalModule,
    // FlatpickrModule.forRoot(),
    // BrowserModule,
    // BrowserAnimationsModule,
  ],
  declarations: [
    PageNotFoundComponent,
    AddPropertyForm,
    // AdminRequests,
    AdminReqs,
    AdminRequestsArchive,
    AdminRequestsSpam,
    AdminDashboardComponent,

    ReviewRequestDialog,

    LoginComponent,

    AdminProperties,
    AdminPropertiesUnits,

    CountryDropdown,
    IndividualDocumentsComponent,
    AllClientsDocuments,
    TableSearchBarComponent,
    TableFiltersComponent,
    RequestTimelineComponent,
    ReviewRequestAdmin,
    LoadingTableAdminReqs,
    LoadingTableAdminCLients,
    LoadingTableAdminProperties,
    LoadingTableAdminPropertiesUnits,
    AdminAllLandlordClients,
    AdminAllTenantClients,
    UserChatsComponent,

    BackButtonDirective,

    
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AdminLayoutModule {}
