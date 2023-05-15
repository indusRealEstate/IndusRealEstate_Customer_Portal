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
import { RequestPage } from "app/request-page/request-page";
import { CustomerCareComponent } from "app/indus_services/customer_service/customer_care";
import { ServiceTemplateComponent } from "app/indus_services/facility_management/service_template/service_template";
import { ServiceRecapComponent } from "app/indus_services/facility_management/service_recap/service_recap";
import { AdminClientsLandlord } from "app/admin_clients_landlord/admin_clients_landlord";
import { AdminClientsTenant } from "app/admin_clients_tenant/admin_clients_tenant";
import { AdminPropertiesRent } from "app/admin_properties_rent/admin_properties_rent";
import { AdminPropertiesSale } from "app/admin_properties_sale/admin_properties_sale";
import { NotificationsPage } from "app/notifications-page/notifications-page";
import { IndividualDocumentsComponent } from "app/documents-individual/documents-individual.component";
import { AdminReqs } from "app/admin-requests/admin-req";
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

export const AdminLayoutRoutes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "reports", component: ReportsComponent },
  { path: "my-requests", component: RequestsComponentMyReqs },
  { path: "payment-requests", component: RequestsComponentPayment },
  { path: "conditioning-requests", component: RequestsComponentConditioning },
  { path: "maintenance-requests", component: RequestsComponentMaintenance},
  { path: "tenant-move-in-requests", component: RequestsComponentTenantMoveIn},
  { path: "tenant-move-out-requests", component: RequestsComponentTenantMoveOut},
  { path: "my-properties", component: MyPropertiesComponent },
  { path: "my-documents", component: DocumentsComponentMyDoc },
  { path: "my-tenant-documents", component: DocumentsComponentMyTenantDoc },
  { path: "my-tenants", component: MyTenantsLandlord },
  { path: "client-documents", component: IndividualDocumentsComponent },
  { path: "property-page", component: PropertyPage },
  { path: "request-page", component: RequestPage },
  { path: "add-property-form", component: AddPropertyForm },
  // admin pages
  { path: "admin-dashboard", component: AdminDashboardComponent },
  // { path: "admin-requests", component: AdminRequests },
  { path: "admin-requests", component: AdminReqs },
  { path: "admin-requests-landlord", component: AdminReqsLandlord },
  { path: "admin-requests-tenant", component: AdminReqsTenant },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "landlord-register-form", component: LandlordFormComponent },
  { path: "tenant-register-form", component: TenantRegisterComponent },
  { path: "admin-clients-landlord", component: AdminClientsLandlord },
  { path: "admin-clients-tenant", component: AdminClientsTenant },
  { path: "admin-properties-rent", component: AdminPropertiesRent },
  { path: "admin-properties-sale", component: AdminPropertiesSale },
  { path: "customer-care", component: CustomerCareComponent },
  { path: "service-temp", component: ServiceTemplateComponent },
  { path: "service-recap", component: ServiceRecapComponent },
  { path: "notifications", component: NotificationsPage },
  { path: "404", component: PageNotFoundComponent },
  { path: "**", redirectTo: "/404" },
];
