import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog',
    styleUrls: ['dialog.css'],
    templateUrl: 'dialog.component.html',
})
export class dialogComponent implements OnInit {
    public editText: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<dialogComponent>,
    ) { }

    ngOnInit() {
        this.editText = this.data["data"];
    }

    onCloseDialog() {
        this.dialogRef.close();
    }

    submitEditedData(value: any) {
        this.dialogRef.close({ "index": this.data["index"], "data": value});
    }
}
