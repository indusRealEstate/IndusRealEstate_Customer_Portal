import { Routes } from "@angular/router";

import { HomeComponent } from "../home/home.component";
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { ReportsComponent } from "../reports/reports.component";
import { MyRequestsComponent } from "app/myRequests/my_requests.component";
import { MyPropertiesComponent } from "app/myProperties/my_properties.component";
import { AppointmentsComponent } from "app/appointments/appointments.component";
import { DocumentsComponent } from "app/documents/documents.component";
import { NewPaymentComponent } from "app/new_payment/new_payment.component";
import { FM_MaintananceRequest } from "app/indus_services/facility_management/fm-maintanence_request/fm-maintanence_request.component";
import { Owner_Move_in_Request } from "app/indus_services/facility_management/owner_move-in_request/owner_move-in_request.component";
import { Owner_Move_out_Request } from "app/indus_services/facility_management/owner_move-out_request/owner_move-out_request.component";
import { Tenant_Move_out_Request } from "app/indus_services/facility_management/tenant_move-out_request/tenant_move-out_request.component";
import { Tenant_Registration } from "app/indus_services/facility_management/tenant_registration/tenant_registration.component";
import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";
import { AddPropertyForm } from "app/add-property-form/add_property_from";
import { AdminRequests } from "app/admin-requests/admin-requests";
import { PropertyPage } from "app/property-page/property-page.component";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { LoginComponent } from "app/login/login.component";
import { RegisterComponent } from "app/register/register.component";
import { LandlordFormComponent } from "app/landlord_register_form/landlord_form.component";
import { TenantFormComponent } from "app/tenant_register_form/tenant_form.component";
import { RequestPage } from "app/request-page/request-page";

export const AdminLayoutRoutes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "reports", component: ReportsComponent },
  { path: "my-requests", component: MyRequestsComponent },
  { path: "my-properties", component: MyPropertiesComponent },
  { path: "appointments", component: AppointmentsComponent },
  { path: "documents", component: DocumentsComponent },
  { path: "new-payment", component: NewPaymentComponent },
  { path: "fm-maintanence-request", component: FM_MaintananceRequest },
  { path: "owner-move-in-request", component: Owner_Move_in_Request },
  { path: "owner-move-out-request", component: Owner_Move_out_Request },
  { path: "tenant-move-out-request", component: Tenant_Move_out_Request },
  { path: "tenant-registration", component: Tenant_Registration },
  { path: "property-page", component: PropertyPage },
  { path: "request-page", component: RequestPage },
  { path: "add-property-form", component: AddPropertyForm },
  // admin pages
  { path: "admin-dashboard", component: AdminDashboardComponent },
  { path: "admin-requests", component: AdminRequests },
  { path: "404", component: PageNotFoundComponent },
  // { path: "**", redirectTo: "/404" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "landlord-register-form", component: LandlordFormComponent },
  { path: "tenant-register-form", component: TenantFormComponent },
];