import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { dialogComponent } from 'app/components/dialog/dialog.component';
declare var $: any;

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})

export class counterComponent implements OnInit {


  public counterValue: number = null;
  public currentIndex: number = null;

  public newValue: string;

  public data: Array<string> = [];

  constructor(private dialog?: MatDialog) { }

  openDialog(index: number) {
    this.dialog.open(dialogComponent, {
      width: '250px',
      height: '200px',
      data: { "index": index, "data": this.data[index] }
    }).afterClosed()
      .subscribe(res => {
        this.data[res["index"]] = res["data"];
      })
  }

  showCounter(from, align) {

  }

  pressCounter() {
    this.counterValue++;
  }

  addData(value: string) {
    if (value) {
      this.data.push(value)
      this.newValue = '';
      // console.log(this.data);
    }
  }


  editData(value: any) {
    var index = this.data.indexOf(value);
    this.currentIndex = index;
    // console.log(value);
    this.openDialog(index);
  }


  deleteData(value: any) {
    var index = this.data.indexOf(value);
    if (index > -1) {
      this.data.splice(index, 1);
    }
    // console.log(this.data);
  }

  ngOnInit() {
    this.counterValue = 0;
  }
}


