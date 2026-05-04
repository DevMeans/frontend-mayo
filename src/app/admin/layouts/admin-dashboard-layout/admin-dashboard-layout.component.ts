import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet],
  templateUrl: './admin-dashboard-layout.component.html',
  styleUrls: ['./admin-dashboard-layout.component.css']
})
export class AdminDashboardLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
