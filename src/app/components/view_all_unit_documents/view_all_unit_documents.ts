import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "view_all_unit_documents",
  styleUrls: ["./view_all_unit_documents.scss"],
  templateUrl: "./view_all_unit_documents.html",
})
export class ViewAllUnitDocuments implements OnInit {

  unit_doc_array: string[] = [];
  unit_id: string;
  selected_doc: string = "";
  data_source: MatTableDataSource<any>;
  displayedColumns: string[] = ["name","download"];
  

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewAllUnitDocuments>,
  ) {
    for(let i = 0; i < JSON.parse(data.doc).length; i++){
      this.unit_doc_array.push(JSON.parse(data.doc)[i]);
    }
    this.unit_id = data.id;

    this.data_source = new MatTableDataSource<any>(this.unit_doc_array);

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
