import { Component, OnInit } from '@angular/core';


const ELEMENT_DATA: any = [
  { caseNumber: '00123456780', reqType: 'Make a payment', propertyName: 'undefined', status: 'Closed', createdDate: '01/01/2023' },
  { caseNumber: '00123456780', reqType: 'Make a payment', propertyName: 'undefined', status: 'Pending', createdDate: '01/01/2023' },
  { caseNumber: '00123456780', reqType: 'Make a payment', propertyName: 'undefined', status: 'Closed', createdDate: '01/01/2023' },
  { caseNumber: '00123456780', reqType: 'Make a payment', propertyName: 'undefined', status: 'Cancelled', createdDate: '01/01/2023' },
  { caseNumber: '00123456780', reqType: 'Tenant move-in request', propertyName: 'undefined', status: 'Closed', createdDate: '01/01/2023' },
  { caseNumber: '00123456780', reqType: 'Tenant move-in request', propertyName: 'undefined', status: 'Pending', createdDate: '01/01/2023' },
  { caseNumber: '00123456780', reqType: 'Tenent Registration', propertyName: 'undefined', status: 'Closed', createdDate: '01/01/2023' },
  { caseNumber: '00123456780', reqType: 'Make a payment', propertyName: 'undefined', status: 'Cancelled', createdDate: '01/01/2023' },
  { caseNumber: '00123456780', reqType: 'Make a payment', propertyName: 'undefined', status: 'Closed', createdDate: '01/01/2023' },
  { caseNumber: '00123456780', reqType: 'Tenent Registration', propertyName: 'undefined', status: 'Closed', createdDate: '01/01/2023' },
];

@Component({
  selector: 'app-myRequests',
  templateUrl: './my_requests.component.html',
  styleUrls: ['./my_requests.component.scss']
})
export class MyRequestsComponent implements OnInit {
  selectedEntry: any = '10';

  constructor() { }
  ngOnInit() {
  }
  displayedColumns: string[] = ['case-number', 'request-type', 'property-name', 'status', 'created-date'];
  dataSource = ELEMENT_DATA;

}
