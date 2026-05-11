import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './admin-dashboard-layout.component.html',
  styleUrls: ['./admin-dashboard-layout.component.css']
})
export class AdminDashboardLayoutComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
  }

  logout() {
    // Call logout endpoint if needed
    this.http.post('http://localhost:3000/api/auth/logout', {})
      .subscribe({
        next: () => {
          this.clearSession();
        },
        error: () => {
          this.clearSession();
        }
      });
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
