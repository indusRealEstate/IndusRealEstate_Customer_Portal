import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ReportsComponent } from '../../reports/reports.component';
import { counterComponent } from '../../counter/counter.component';
import { MyRequestsComponent } from 'app/myRequests/my_requests.component';
import { MyPropertiesComponent } from 'app/myProperties/my_properties.component';
import { AppointmentsComponent } from 'app/appointments/appointments.component';
import { DocumentsComponent } from 'app/documents/documents.component';
import { NewPaymentComponent } from 'app/new_payment/new_payment.component';
import { LoginComponent } from 'app/login/login.component';
import { RegisterComponent } from 'app/register/register.component';
import { FM_MaintananceRequest } from 'app/indus_services/facility_management/fm-maintanence_request/fm-maintanence_request.component';
import { Owner_Move_in_Request } from 'app/indus_services/facility_management/owner_move-in_request/owner_move-in_request.component';
import { Owner_Move_out_Request } from 'app/indus_services/facility_management/owner_move-out_request/owner_move-out_request.component';
import { Tenant_Move_out_Request } from 'app/indus_services/facility_management/tenant_move-out_request/tenant_move-out_request.component';
import { Tenant_Registration } from 'app/indus_services/facility_management/tenant_registration/tenant_registration.component';
import { DirectAccessGaurd } from 'app/routeGaurd';


export const AdminLayoutRoutes: Routes = [

    { path: 'home/:id', component: HomeComponent},
    { path: 'user-profile/:id', component: UserProfileComponent },
    { path: 'reports/:id', component: ReportsComponent },
    { path: 'counter/:id', component: counterComponent },
    { path: 'my-requests/:id', component: MyRequestsComponent },
    { path: 'my-properties/:id', component: MyPropertiesComponent },
    { path: 'appointments/:id', component: AppointmentsComponent },
    { path: 'documents/:id', component: DocumentsComponent },
    { path: 'new-payment/:id', component: NewPaymentComponent },
    { path: 'fm-maintanence-request/:id', component: FM_MaintananceRequest },
    { path: 'owner-move-in-request/:id', component: Owner_Move_in_Request },
    { path: 'owner-move-out-request/:id', component: Owner_Move_out_Request },
    { path: 'tenant-move-out-request/:id', component: Tenant_Move_out_Request },
    { path: 'tenant-registration/:id', component: Tenant_Registration },
];
