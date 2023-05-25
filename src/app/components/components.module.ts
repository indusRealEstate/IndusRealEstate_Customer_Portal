import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownMaterial } from "./material_dropdown/dropdown.component";
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
import { ViewDocDialog } from "./view-doc-dialog/view-doc-dialog";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TenantRequestsDropdown } from "./tenant-requests-dropdown/tenant-requests-dropdown";
import { ViewTenantDialog } from "./view-tenant-dialog/view-tenant-dialog";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ViewDocDialogService } from "./view-doc-dialog-service-temp/view-doc-dialog-service";
import { LandlordRequestsDropdown } from "./landlord-requests-dropdown/landlord-requests-dropdown";
import { RelatedDocsDialog } from "./related-documents/related-documents";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatListModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    NgxSkeletonLoaderModule,
    PdfViewerModule,
    MatTooltipModule,
    DragDropModule,
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
    ViewDocDialog,
    ViewTenantDialog,
    ViewDocDialogService,
    RelatedDocsDialog,
  ],
  exports: [FooterComponent, NavbarComponent, SidebarComponent],
})
export class ComponentsModule {}
