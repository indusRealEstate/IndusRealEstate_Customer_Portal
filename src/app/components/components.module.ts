import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AdminRequestsCategory } from "app/admin-requests-category/admin-requests-category";
import { NgxMatIntlTelInputComponent } from "ngx-mat-intl-tel-input";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { AddCategoryDialog } from "./add_category_dialog/add_category_dialog";
import { AddLeaseDialog } from "./add_lease_dialog/add_lease_dialog";
import { AddPropertyDialog } from "./add_property_dialog/add_property_dialog";
import { AddUnitDialog } from "./add_unit_dialog/add_unit_dialog";
import { AddUserDialog } from "./add_user_dialog/add_user_dialog";
import { AnnouncementDetailsDialog } from "./announcement-details-dialog/announcement-details-dialog";
import { CautionDialog } from "./caution-dialog/caution-dialog";
import { CountryDropdown } from "./country-dropdown/country-dropdown";
import { DocUploadDialogRegister } from "./dialog/dialog";
import { DndDirective } from "./dialog/dnd.directive";
import { EditCategoryDialog } from "./edit_category_dialog/edit_category_dialog";
import { EditLeaseDialog } from "./edit_lease_dialog/edit_lease_dialog";
import { EditPropertyDialog } from "./edit_property_dialog/edit_property_dialog";
import { EditUnitDialog } from "./edit_unit_dialog/edit_unit_dialog";
import { EditUserDialog } from "./edit_user_dialog/edit_user_dialog";
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ProgressComponent } from "./progressbar/progress";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SuccessDialogRegister } from "./success-dialog/success_dialog";
import { ViewPaymentDetailsMoreDialog } from "./view-payment-details-more-dialog/view-payment-details-more-dialog";
import { ViewAllUnitDocuments } from "./view_all_unit_documents/view_all_unit_documents";
import { ViewAllUnitInventories } from "./view_all_unit_inventories/view_all_unit_inventories";
import { DialogViewMedia } from "./view_media/view_media";
import { ReniewContractDialog } from "./reniew-contract-dialog/reniew-contract-dialog";
import { GenerateExcelDialog } from "./generate_excel/generate_excel";
import { AddAmenitiesDialog } from "./add_amenities_dialog/add_amenities_dialog";
import { AddInventoriesDialog } from "./add_inventories_dialog/add_inventories_dialog";
import { AddPaymentDialog } from "./add_payment_dialog/add_payment_dialog";
import { EditPaymentDialog } from "./edit_payment_dialog/edit_payment_dialog";
import { PaymentDetailsDialog } from "./payment-details-dialog/payment-details-dialog";
import { ViewChequeDialog } from "./view-cheque-dialog/view-cheque-dialog";
import { ViewCreatedUserDetailsDialog } from "./view-created-user-details-dialog/view-created-user-details-dialog";

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
    EditLeaseDialog,
    CautionDialog,
    AnnouncementDetailsDialog,
    ReniewContractDialog,
    GenerateExcelDialog,
    AddAmenitiesDialog,
    AddInventoriesDialog,
    AddPaymentDialog,
    EditPaymentDialog,
    PaymentDetailsDialog,
    ViewChequeDialog,
    ViewCreatedUserDetailsDialog,
  ],
  exports: [FooterComponent, NavbarComponent, SidebarComponent],
})
export class ComponentsModule {}
