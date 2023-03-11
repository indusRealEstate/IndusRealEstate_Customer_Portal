import { NgModule } from "@angular/core";
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout.component";
import { EmailVerification } from "./email_verficitaion/email_verficitaion";

var userData = localStorage.getItem("currentUser");
var user = JSON.parse(userData);

const routes: Routes = [
  {
    path: "",
    redirectTo: userData == null ? "login" : `home?uid=${user[0]["id"]}`,
    pathMatch: "full",
  },
  {
    path: "email-verification",
    component: EmailVerification,
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout.module").then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule {}
