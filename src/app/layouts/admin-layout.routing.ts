import { Routes } from "@angular/router";

import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";
// import { AdminRequests } from "app/admin-requests/admin-requests";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { LoginComponent } from "app/login/login.component";
import { AdminRequests } from "app/admin-requests/admin-requests";
import { AllClientsDocuments } from "app/documents/all-clients-docs/all-clients-docs";
import { IndividualDocumentsComponent } from "app/documents/individual-docs/individual-docs";
import { ReviewRequestAdmin } from "app/admin-request-review-page/admin-request-review-page";
import { AdminRequestsArchive } from "app/admin-requests-archive/admin-requests-archive";
import { AdminRequestsSpam } from "app/admin-requests-spam/admin-requests-spam";
import { UserChatsComponent } from "app/user_chats/user_chats";
import { AdminProperties } from "app/admin-properties/admin-properties";
import { AdminPropertiesUnits } from "app/admin-properties-units/admin-properties-units";
import { AdminRequestsCategory } from "app/admin-requests-category/admin-requests-category";
import { AllUsersComponent } from "app/all-users/all-users";
import { AdminPropertiesUnitDetails } from "app/admin-property-unit-details/admin-property-unit-details";
import { AllLeasesComponent } from "app/admin-lease/admin-lease";
import { DetailsComponents } from "app/property-details/details-properties";
import { AdminRequestsDetails } from "app/admin-requests-details/admin-requests-details";
import { ViewUserDetails } from "app/admin-user-details/admin-user-details";
import { AdminLeaseDetail } from "app/admin-lease-details/admin-lease-details";
import { AdminReport } from "app/admin-report/admin-report";
import { Announcements } from "app/announcements/announcements";

export const AdminLayoutRoutes: Routes = [
  { path: "all-clients-documents", component: AllClientsDocuments },
  { path: "client-documents", component: IndividualDocumentsComponent },
  // admin pages
  { path: "admin-dashboard", component: AdminDashboardComponent },
  { path: "user-chats", component: UserChatsComponent },
  // { path: "admin-requests", component: AdminRequests },
  { path: "admin-requests", component: AdminRequests },
  { path: "review-request-admin", component: ReviewRequestAdmin },
  { path: "admin-requests-archive", component: AdminRequestsArchive },
  { path: "admin-requests-spam", component: AdminRequestsSpam },
  { path: "login", component: LoginComponent },
  { path: "admin-properties", component: AdminProperties },
  { path: "property-details", component: DetailsComponents },
  { path: "admin-requests-details", component: AdminRequestsDetails },
  { path: "admin-properties-units", component: AdminPropertiesUnits },
  { path: "all-users", component: AllUsersComponent },
  { path: "admin-report", component: AdminReport },
  { path: "admin-lease", component: AllLeasesComponent },
  { path: "404", component: PageNotFoundComponent },
  { path: "admin-request-category", component: AdminRequestsCategory },
  {
    path: "admin-property-unit-details",
    component: AdminPropertiesUnitDetails,
  },
  { path: "admin-lease-details", component: AdminLeaseDetail },
  { path: "admin-user-details", component: ViewUserDetails },
  { path: "announcements", component: Announcements },
  { path: "**", redirectTo: "/404" },
];
