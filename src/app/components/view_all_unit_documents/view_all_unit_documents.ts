import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "view_all_unit_documents",
  styleUrls: ["./view_all_unit_documents.scss"],
  templateUrl: "./view_all_unit_documents.html",
})
export class ViewAllUnitDocuments implements OnInit {

  unit_doc_array: string[] = [];
  unit_id: string;
  selected_doc: string = "";
  

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewAllUnitDocuments>,
    private apiService: ApiService,
    private apiAdminService: AdminService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    for(let i = 0; i < JSON.parse(data.doc).length; i++){
      this.unit_doc_array.push(JSON.parse(data.doc)[i]);
    }
    this.unit_id = data.id;

    console.log(this.unit_doc_array);
  }

  ngOnChanges(){
    
  }


  ngOnInit() {
    window.addEventListener("scrol",()=>{
      console.log("hi");
    })

  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({
      
    });
  }

  downloadDoc(data: string){
    window.open(`https://indusre.app/api/upload/unit/${this.unit_id}/documents/${data}`)
  }
}
