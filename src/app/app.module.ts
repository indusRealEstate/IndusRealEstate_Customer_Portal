import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { IconsModule } from "@progress/kendo-angular-icons";
import "hammerjs";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AdminLayoutComponent } from "./layouts/admin-layout.component";

import { FIREBASE_OPTIONS } from "@angular/fire/compat";
import { SETTINGS as AUTH_SETTINGS } from "@angular/fire/compat/auth";

import { SETTINGS as FIRESTORE_SETTINGS } from "@angular/fire/compat/firestore";

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
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  declarations: [AppComponent, AdminLayoutComponent],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    {
      provide: AUTH_SETTINGS,
      useValue: { appVerificationDisabledForTesting: true },
    },
    {
      provide: FIRESTORE_SETTINGS,
      useValue: { appVerificationDisabledForTesting: true },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

let resolvePersistenceEnabled: (enabled: boolean) => void;
export const persistenceEnabled = new Promise<boolean>((resolve) => {
  resolvePersistenceEnabled = resolve;
});
