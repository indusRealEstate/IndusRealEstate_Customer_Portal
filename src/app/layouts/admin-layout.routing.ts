import { Routes } from "@angular/router";

import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";
import { AddPropertyForm } from "app/add-property-form/add_property_from";
// import { AdminRequests } from "app/admin-requests/admin-requests";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { LoginComponent } from "app/login/login.component";
import { AdminReqs } from "app/admin-requests/admin-requests";
import { AllClientsDocuments } from "app/documents/all-clients-docs/all-clients-docs";
import { IndividualDocumentsComponent } from "app/documents/individual-docs/individual-docs";
import { ReviewRequestAdmin } from "app/admin-request-review-page/admin-request-review-page";
import { AdminRequestsArchive } from "app/admin-requests-archive/admin-requests-archive";
import { AdminRequestsSpam } from "app/admin-requests-spam/admin-requests-spam";
import { AdminAllLandlordClients } from "app/admin-all-landlord-clients/admin-all-landlord-clients";
import { AdminAllTenantClients } from "app/admin-all-tenants-clients/admin-all-tenants-clients";
import { UserChatsComponent } from "app/user_chats/user_chats";
import { AdminProperties } from "app/admin-properties/admin-properties";
import { AdminPropertiesUnits } from "app/admin-properties-units/admin-properties-units";
import { AdminRequestsCategory } from "app/admin-requests-category/admin-requests-category";
import { AllUsersComponent } from "app/all-users/all-users";

export const AdminLayoutRoutes: Routes = [
  { path: "all-clients-documents", component: AllClientsDocuments },
  { path: "client-documents", component: IndividualDocumentsComponent },
  { path: "add-property-form", component: AddPropertyForm },
  // admin pages
  { path: "admin-dashboard", component: AdminDashboardComponent },
  { path: "user-chats", component: UserChatsComponent },
  // { path: "admin-requests", component: AdminRequests },
  { path: "admin-requests", component: AdminReqs },
  { path: "review-request-admin", component: ReviewRequestAdmin },
  { path: "admin-requests-archive", component: AdminRequestsArchive },
  { path: "admin-requests-spam", component: AdminRequestsSpam },
  { path: "login", component: LoginComponent },
  { path: "admin-all-landlords", component: AdminAllLandlordClients },
  { path: "admin-all-tenants", component: AdminAllTenantClients },
  { path: "admin-properties", component: AdminProperties },
  { path: "admin-properties-units", component: AdminPropertiesUnits },
  { path: "all-users", component: AllUsersComponent },
  { path: "404", component: PageNotFoundComponent },
  { path: "admin-request-category", component: AdminRequestsCategory },
  { path: "**", redirectTo: "/404" },
];
