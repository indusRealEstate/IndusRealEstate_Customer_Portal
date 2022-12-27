import { Component, OnInit } from '@angular/core';

const ELEMENT_DATA: any = [
  { documentName: 'Sample_doc', date: '01/01/2023', size: '160.00 KB', extension: '.msg', view: 'view' },
  { documentName: 'Security Clearance Doc - TS 00 000', date: '01/01/2023', size: '12.13 KB', extension: '.pdf', view: 'view' },
];

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  selectedEntry: any = '10';
  constructor() { }

  displayedColumns: string[] = ['document-name', 'date', 'size', 'extension', 'view'];
  dataSource = ELEMENT_DATA;

  ngOnInit() {
  }

}
