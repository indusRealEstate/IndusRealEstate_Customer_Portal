import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';



@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  selectedEntry: any = '10';

  dataSource = new MatTableDataSource<any>();

  isUserSignedIn: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private authenticationService: AuthenticationService,) { }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(['/login']);
    }
  }


  displayedColumns: string[] = ['document-name', 'date', 'size', 'extension', 'view'];

  ngOnInit() {
    this.isUserSignOut();
    this.getUserDocuments();
  }

  getUserDocuments() {
    var data = localStorage.getItem('currentUser');
    var user = JSON.parse(data);
    var userId = user[0]["id"];

    this.apiService.getUserDocuments(userId).subscribe((data: any) => {
      // console.log(JSON.stringify(data));
      // console.log(data);
      this.dataSource.data = data;
    });
  }

}
