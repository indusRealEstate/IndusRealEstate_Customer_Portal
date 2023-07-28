import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownMaterial } from "./tenant-reg-dropdown/dropdown.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatListModule } from "@angular/material/list";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { DocUploadDialogRegister } from "./dialog/dialog";
import { ProgressComponent } from "./progressbar/progress";
import { SuccessDialogRegister } from "./success-dialog/success_dialog";
import { DndDirective } from "./dialog/dnd.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TenantRequestsDropdown } from "./tenant-requests-dropdown/tenant-requests-dropdown";
import { ViewTenantDialog } from "./view-tenant-dialog/view-tenant-dialog";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { LandlordRequestsDropdown } from "./landlord-requests-dropdown/landlord-requests-dropdown";
import { RelatedDocsDialog } from "./related-documents/related-documents";
import { ViewImageDialog } from "./view-image-dialog/view-image-dialog";
import { RelatedRequestsDialog } from "./related-requests/related-requests";
import { SeeAllUserReqsAdminDialog } from "./see-all-user-reqs-admin/see-all-user-reqs-admin";
import { ViewEventDialog } from "./view-event-dialog/view-event-dialog";
import { AdminViewTenantDialog } from "./admin-view-tenant-dialog/admin-view-tenant-dialog";
import { AddPropertyDialog } from "./add_property_dialog/add_property_dialog";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { AddUnitDialog } from "./add_unit_dialog/add_unit_dialog";
import { AdminRequestsCategory } from "app/admin-requests-category/admin-requests-category";
import { AddCategoryDialog } from "./add_category_dialog/add_category_dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { EditCategoryDialog } from "./edit_category_dialog/edit_category_dialog";
import { AddUserDialog } from "./add_user_dialog/add_user_dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CountryDropdown } from "./country-dropdown/country-dropdown";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgxMatIntlTelInputComponent } from "ngx-mat-intl-tel-input";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    NgxSkeletonLoaderModule,
    MatTooltipModule,
    DragDropModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    NgxMatIntlTelInputComponent,
    MatProgressBarModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DropdownMaterial,
    TenantRequestsDropdown,
    LandlordRequestsDropdown,
    DocUploadDialogRegister,
    ProgressComponent,
    SuccessDialogRegister,
    DndDirective,
    ViewTenantDialog,
    RelatedDocsDialog,
    ViewImageDialog,
    RelatedRequestsDialog,
    SeeAllUserReqsAdminDialog,
    ViewEventDialog,
    AdminViewTenantDialog,
    AddPropertyDialog,
    AddUnitDialog,
    AdminRequestsCategory,
    AddCategoryDialog,
    EditCategoryDialog,
    AddUserDialog,
    CountryDropdown,
  ],
  exports: [FooterComponent, NavbarComponent, SidebarComponent],
})
export class ComponentsModule {}
