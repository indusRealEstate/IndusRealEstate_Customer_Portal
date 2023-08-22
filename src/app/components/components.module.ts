import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { DragDropModule } from "@angular/cdk/drag-drop";
import { RelatedDocsDialog } from "./related-documents/related-documents";
import { ViewImageDialog } from "./view-image-dialog/view-image-dialog";
import { RelatedRequestsDialog } from "./related-requests/related-requests";
import { SeeAllUserReqsAdminDialog } from "./see-all-user-reqs-admin/see-all-user-reqs-admin";
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
import { AddLeaseDialog } from "./add_lease_dialog/add_lease_dialog";
import { DialogViewMedia } from "./view_media/view_media";
import { EditPropertyDialog } from "./edit_property_dialog/edit_property_dialog";
import { EditUnitDialog } from "./edit_unit_dialog/edit_unit_dialog";
import { ViewAllUnitDocuments } from "./view_all_unit_documents/view_all_unit_documents";
import { ViewAllUnitInventories } from "./view_all_unit_inventories/view_all_unit_inventories";
import { ViewPaymentDetailsMoreDialog } from "./view-payment-details-more-dialog/view-payment-details-more-dialog";
import { EditUserDialog } from "./edit_user_dialog/edit_user_dialog";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatCheckboxModule } from "@angular/material/checkbox";

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
    ScrollingModule,
    MatCheckboxModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DocUploadDialogRegister,
    ProgressComponent,
    SuccessDialogRegister,
    DndDirective,
    RelatedDocsDialog,
    ViewImageDialog,
    RelatedRequestsDialog,
    SeeAllUserReqsAdminDialog,
    AdminViewTenantDialog,
    AddPropertyDialog,
    EditPropertyDialog,
    AddUnitDialog,
    AdminRequestsCategory,
    AddCategoryDialog,
    EditCategoryDialog,
    AddUserDialog,
    AddLeaseDialog,
    CountryDropdown,
    DialogViewMedia,
    EditUnitDialog,
    ViewAllUnitDocuments,
    ViewAllUnitInventories,
    ViewPaymentDetailsMoreDialog,
    EditUserDialog,
  ],
  exports: [FooterComponent, NavbarComponent, SidebarComponent],
})
export class ComponentsModule {}
