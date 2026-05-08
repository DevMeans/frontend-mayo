import { Injectable, signal } from '@angular/core';

export interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  currentAlert = signal<Alert | null>(null);
  private alertCounter = 0;

  constructor() {}

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
    const id = `alert-${++this.alertCounter}`;
    const alert: Alert = { id, message, type };

    this.currentAlert.set(alert);

    if (duration > 0) {
      setTimeout(() => {
        this.close();
      }, duration);
    }
  }

  close() {
    this.currentAlert.set(null);
  }
}
