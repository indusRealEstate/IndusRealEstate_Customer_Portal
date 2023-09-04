import { Routes } from "@angular/router";

import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";
// import { AdminRequests } from "app/admin-requests/admin-requests";
import { AdminLeaseDetail } from "app/admin-lease-details/admin-lease-details";
import { AllLeasesComponent } from "app/admin-lease/admin-lease";
import { AdminPropertiesUnits } from "app/admin-properties-units/admin-properties-units";
import { AdminProperties } from "app/admin-properties/admin-properties";
import { AdminPropertiesUnitDetails } from "app/admin-property-unit-details/admin-property-unit-details";
import { AdminReport } from "app/admin-report/admin-report";
import { AdminRequestsArchive } from "app/admin-requests-archive/admin-requests-archive";
import { AdminRequestsCategory } from "app/admin-requests-category/admin-requests-category";
import { AdminRequestsDetails } from "app/admin-requests-details/admin-requests-details";
import { AdminRequests } from "app/admin-requests/admin-requests";
import { ViewUserDetails } from "app/admin-user-details/admin-user-details";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { AllUsersComponent } from "app/all-users/all-users";
import { Announcements } from "app/announcements/announcements";
import { LoginComponent } from "app/login/login.component";
import { DetailsComponents } from "app/property-details/details-properties";
import { UserChatsComponent } from "app/user_chats/user_chats";

export const AdminLayoutRoutes: Routes = [
  // admin pages
  { path: "dashboard", component: AdminDashboardComponent },
  { path: "user-chats", component: UserChatsComponent },
  // { path: "admin-requests", component: AdminRequests },
  { path: "requests", component: AdminRequests },
  { path: "requests-archive", component: AdminRequestsArchive },
  // { path: "admin-requests-spam", component: AdminRequestsSpam },
  { path: "login", component: LoginComponent },
  { path: "properties", component: AdminProperties },
  { path: "property-details", component: DetailsComponents },
  { path: "requests-details", component: AdminRequestsDetails },
  { path: "properties-units", component: AdminPropertiesUnits },
  { path: "all-users", component: AllUsersComponent },
  { path: "report", component: AdminReport },
  { path: "contracts", component: AllLeasesComponent },
  { path: "404", component: PageNotFoundComponent },
  { path: "request-category", component: AdminRequestsCategory },
  {
    path: "property-unit-details",
    component: AdminPropertiesUnitDetails,
  },
  { path: "contract-details", component: AdminLeaseDetail },
  { path: "user-details", component: ViewUserDetails },
  { path: "announcements", component: Announcements },
  // { path: "staffs", component: AdminStaffs },
  { path: "**", redirectTo: "/404" },
];
