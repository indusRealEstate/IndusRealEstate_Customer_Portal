import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { A11yModule } from "@angular/cdk/a11y";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTreeModule } from "@angular/material/tree";
import { FullCalendarModule } from "@fullcalendar/angular";
import { LoginComponent } from "app/login/login.component";
import { RegisterComponent } from "app/register/register.component";
import { AuthLayoutRoutes } from "./auth-layout.routing";
import { LandlordFormComponent } from "app/landlord_register_form/landlord_form.component";
import { TenantFormComponent } from "app/tenant_register_form/tenant_form.component";
import { StepperLandlordRegisterFirst } from "app/landlord_register_form/components/stepper_01_reg_landlord/stepper_first_reg_landlord";
import { StepperLandlordRegisterSecond } from "app/landlord_register_form/components/stepper_02_reg_landlord/stepper_second_reg_landlord";
import { StepperLandlordRegisterThird } from "app/landlord_register_form/components/stepper_03_reg_landlord/stepper_third_reg_landlord";
import { HttpClientModule } from "@angular/common/http";
import { StepperTenantRegisterFirst } from "app/tenant_register_form/components/stepper_01_reg_tenant/stepper_first_reg_tenant";
import { StepperTenantRegisterSecond } from "app/tenant_register_form/components/stepper_02_reg_tenant/stepper_second_reg_tenant";
import { StepperTenantRegisterThird } from "app/tenant_register_form/components/stepper_03_reg_tenant/stepper_third_reg_tenant";
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    A11yModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTreeModule,
    MatNativeDateModule,
    FullCalendarModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LandlordFormComponent,
    TenantFormComponent,

    // Landlord Reg
    StepperLandlordRegisterFirst,
    StepperLandlordRegisterSecond,
    StepperLandlordRegisterThird,

    // Tenant Reg
    StepperTenantRegisterFirst,
    StepperTenantRegisterSecond,
    StepperTenantRegisterThird,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AuthLayoutModule {}
