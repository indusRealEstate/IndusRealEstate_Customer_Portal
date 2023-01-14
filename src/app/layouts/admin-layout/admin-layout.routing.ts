import { Routes } from "@angular/router";

import { HomeComponent } from "../../home/home.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { ReportsComponent } from "../../reports/reports.component";
import { counterComponent } from "../../counter/counter.component";
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
import { DirectAccessGaurd } from "app/routeGaurd";
import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";

export const AdminLayoutRoutes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "reports", component: ReportsComponent },
  { path: "counter", component: counterComponent },
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
  { path: "404", component: PageNotFoundComponent },
  // { path: "**", redirectTo: "/404" },
];
