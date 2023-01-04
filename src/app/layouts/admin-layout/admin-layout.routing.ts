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

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'home', component: HomeComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'counter', component: counterComponent },
    { path: 'my-requests', component: MyRequestsComponent },
    { path: 'my-properties', component: MyPropertiesComponent },
    { path: 'appointments', component: AppointmentsComponent },
    { path: 'documents', component: DocumentsComponent },
    { path: 'new-payment', component: NewPaymentComponent },
];
