import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  acceptText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  confirmOptions = signal<ConfirmOptions | null>(null);
  private resolveCallback: ((value: boolean) => void) | null = null;

  constructor() {}

  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
      this.confirmOptions.set(options);
    });
  }

  accept() {
    if (this.resolveCallback) {
      this.resolveCallback(true);
    }
    this.close();
  }

  cancel() {
    if (this.resolveCallback) {
      this.resolveCallback(false);
    }
    this.close();
  }

  private close() {
    this.confirmOptions.set(null);
    this.resolveCallback = null;
  }
}
