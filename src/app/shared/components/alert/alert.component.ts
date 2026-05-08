import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  alertService: AlertService;

  constructor(alertService: AlertService) {
    this.alertService = alertService;
  }

  ngOnInit() {
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
      default:
        return 'text-info';
    }
  }

  getTitleColor(type: string): string {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
      default:
        return 'text-info';
    }
  }

  getButtonClass(type: string): string {
    switch (type) {
      case 'success':
        return 'btn-success';
      case 'error':
        return 'btn-error';
      case 'warning':
        return 'btn-warning';
      case 'info':
      default:
        return 'btn-info';
    }
  }

  getAlertClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  }

  closeAlert() {
    this.alertService.close();
  }
}
