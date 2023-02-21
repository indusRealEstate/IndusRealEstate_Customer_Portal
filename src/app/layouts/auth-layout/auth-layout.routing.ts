import { Routes } from "@angular/router";
import { EmailVerification } from "app/email_verficitaion/email_verficitaion";
import { LandlordFormComponent } from "app/landlord_register_form/landlord_form.component";

import { LoginComponent } from "app/login/login.component";
import { RegisterComponent } from "app/register/register.component";
import { TenantFormComponent } from "app/tenant_register_form/tenant_form.component";

export const AuthLayoutRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "landlord-register-form", component: LandlordFormComponent },
  { path: "tenant-register-form", component: TenantFormComponent },
];
