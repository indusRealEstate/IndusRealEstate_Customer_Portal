import { HttpClientModule } from "@angular/common/http";
import { NgModule, isDevMode } from "@angular/core";
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
import { environment } from "../environments/environment.prod";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AdminLayoutComponent } from "./layouts/admin-layout.component";

import { FIREBASE_OPTIONS } from "@angular/fire/compat";
// import { ServiceWorkerModule } from "@angular/service-worker";
import { getMessaging, provideMessaging } from "@angular/fire/messaging";
import { SERVICE_WORKER, VAPID_KEY } from "@angular/fire/compat/messaging";
import { VAPIDKEYS } from "./keys/vapid";
import { ServiceWorkerModule } from "@angular/service-worker";

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
    provideMessaging(() => getMessaging()),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
  declarations: [AppComponent, AdminLayoutComponent],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    // {
    //   provide: SERVICE_WORKER,
    //   useValue: "ngsw-worker.js",
    // },
    // {
    //   provide: VAPID_KEY,
    //   useValue: VAPIDKEYS.PUBLIC_KEY,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

let resolvePersistenceEnabled: (enabled: boolean) => void;
export const persistenceEnabled = new Promise<boolean>((resolve) => {
  resolvePersistenceEnabled = resolve;
});
