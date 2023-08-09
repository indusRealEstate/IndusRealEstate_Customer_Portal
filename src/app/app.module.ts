import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import {
  connectFirestoreEmulator,
  provideFirestore,
} from "@angular/fire/firestore";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { IconsModule } from "@progress/kendo-angular-icons";
import { environment } from "environments/environment";
import { getFirestore } from "firebase/firestore";
import "hammerjs";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AdminLayoutComponent } from "./layouts/admin-layout.component";

import { getAuth, provideAuth } from "@angular/fire/auth";
import { getApp } from "firebase/app";

// import { HashLocationStrategy, LocationStrategy } from "@angular/common";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    ChartsModule,
    IconsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  declarations: [AppComponent, AdminLayoutComponent],

  // providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

let resolvePersistenceEnabled: (enabled: boolean) => void;
export const persistenceEnabled = new Promise<boolean>((resolve) => {
  resolvePersistenceEnabled = resolve;
});
