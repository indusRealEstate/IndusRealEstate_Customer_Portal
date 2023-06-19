import { Routes } from "@angular/router";

import { HomeComponent } from "../home/home.component";
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { ReportsComponent } from "../reports/reports.component";
import { MyPropertiesComponent } from "app/myProperties/my_properties.component";
import { PageNotFoundComponent } from "app/404_page_not_found/404_page_not_found.component";
import { AddPropertyForm } from "app/add-property-form/add_property_from";
// import { AdminRequests } from "app/admin-requests/admin-requests";
import { PropertyPage } from "app/property-page/property-page.component";
import { AdminDashboardComponent } from "app/admin_dashboard/admin_dashboard";
import { LoginComponent } from "app/login/login.component";
import { RegisterComponent } from "app/register/register.component";
import { LandlordFormComponent } from "app/landlord_register_form/landlord_form.component";
import { TenantRegisterComponent } from "app/indus_services/facility_management/tenant_register_form/tenant_form.component";
import { CustomerCareComponent } from "app/indus_services/customer_service/customer_care";
import { ServiceTemplateComponent } from "app/indus_services/facility_management/service_template/service_template";
import { ServiceRecapComponent } from "app/indus_services/facility_management/service_recap/service_recap";
import { AdminPropertiesRent } from "app/admin_properties_rent/admin_properties_rent";
import { AdminPropertiesSale } from "app/admin_properties_sale/admin_properties_sale";
import { AdminReqs } from "app/admin-requests/admin-requests";
import { AdminReqsLandlord } from "app/admin-requests-landlord/admin-req-landlord";
import { AdminReqsTenant } from "app/admin-requests-tenant/admin-req-tenant";
import { RequestsComponentMyReqs } from "app/requests/my-requests/my-reqs";
import { RequestsComponentPayment } from "app/requests/payment/payment-req";
import { RequestsComponentConditioning } from "app/requests/tenant-requests/conditoning/conditioning-req";
import { RequestsComponentMaintenance } from "app/requests/tenant-requests/maintenance/maintenance-req";
import { RequestsComponentTenantMoveIn } from "app/requests/tenant-requests/tenant-move-in/tenant-move-in-req";
import { RequestsComponentTenantMoveOut } from "app/requests/tenant-requests/tenant-move-out/tenant-move-out-req";
import { DocumentsComponentMyDoc } from "app/documents/my-documents/my-docs";
import { DocumentsComponentMyTenantDoc } from "app/documents/my-tenant-documents/my-tenant-docs";
import { MyTenantsLandlord } from "app/my-tenants/my-tenants";
import { MyLandlordComponent } from "app/my-landlord/my-landlord";
import { AllClientsDocuments } from "app/documents/all-clients-docs/all-clients-docs";
import { IndividualDocumentsComponent } from "app/documents/individual-docs/individual-docs";
import { RequestsComponentInspection } from "app/requests/landlord-requests/inspection/inspection-req";
import { ReviewRequestAdmin } from "app/admin-request-review-page/admin-request-review-page";
import { AdminRequestsArchive } from "app/admin-requests-archive/admin-requests-archive";
import { AdminRequestsSpam } from "app/admin-requests-spam/admin-requests-spam";
import { AdminAllLandlordClients } from "app/admin-all-landlord-clients/admin-all-landlord-clients";
import { AdminAllTenantClients } from "app/admin-all-tenants-clients/admin-all-tenants-clients";
import { UserChatsComponent } from "app/user_chats/user_chats";

export const AdminLayoutRoutes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "reports", component: ReportsComponent },
  { path: "my-requests", component: RequestsComponentMyReqs },
  { path: "payment-requests", component: RequestsComponentPayment },
  { path: "conditioning-requests", component: RequestsComponentConditioning },
  { path: "inspection-requests", component: RequestsComponentInspection },
  { path: "maintenance-requests", component: RequestsComponentMaintenance },
  { path: "tenant-move-in-requests", component: RequestsComponentTenantMoveIn },
  {
    path: "tenant-move-out-requests",
    component: RequestsComponentTenantMoveOut,
  },
  { path: "my-properties", component: MyPropertiesComponent },
  { path: "my-documents", component: DocumentsComponentMyDoc },
  { path: "all-clients-documents", component: AllClientsDocuments },
  { path: "my-tenant-documents", component: DocumentsComponentMyTenantDoc },
  { path: "my-tenants", component: MyTenantsLandlord },
  { path: "my-landlord", component: MyLandlordComponent },
  { path: "client-documents", component: IndividualDocumentsComponent },
  { path: "property-page", component: PropertyPage },
  { path: "add-property-form", component: AddPropertyForm },
  // admin pages
  { path: "admin-dashboard", component: AdminDashboardComponent },
  { path: "user-chats", component: UserChatsComponent },
  // { path: "admin-requests", component: AdminRequests },
  { path: "admin-requests", component: AdminReqs },
  { path: "review-request-admin", component: ReviewRequestAdmin },
  { path: "admin-requests-landlord", component: AdminReqsLandlord },
  { path: "admin-requests-tenant", component: AdminReqsTenant },
  { path: "admin-requests-archive", component: AdminRequestsArchive },
  { path: "admin-requests-spam", component: AdminRequestsSpam },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "landlord-register-form", component: LandlordFormComponent },
  { path: "tenant-register-form", component: TenantRegisterComponent },
  { path: "admin-all-landlords", component: AdminAllLandlordClients },
  { path: "admin-all-tenants", component: AdminAllTenantClients },
  { path: "admin-properties-rent", component: AdminPropertiesRent },
  { path: "admin-properties-sale", component: AdminPropertiesSale },
  { path: "customer-care", component: CustomerCareComponent },
  { path: "service-temp", component: ServiceTemplateComponent },
  { path: "service-recap", component: ServiceRecapComponent },
  { path: "404", component: PageNotFoundComponent },
  { path: "**", redirectTo: "/404" },
];
