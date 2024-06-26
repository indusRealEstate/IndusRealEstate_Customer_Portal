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
import { TableComponent } from "./table/table.component";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { DocUploadDialogRegister } from "./dialog/dialog";
import { ProgressComponent } from "./progressbar/progress";
import { SuccessDialogRegister } from "./success-dialog/success_dialog";
import { DndDirective } from "./dialog/dnd.directive";
import { MatFormFieldModule } from "@angular/material/form-field";

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
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DropdownMaterial,
    TableComponent,
    DocUploadDialogRegister,
    ProgressComponent,
    SuccessDialogRegister,
    DndDirective,
  ],
  exports: [FooterComponent, NavbarComponent, SidebarComponent],
})
export class ComponentsModule {}
