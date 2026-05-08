import { Component } from '@angular/core';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
  standalone: true
})
export class ConfirmModalComponent {
  constructor(public confirmService: ConfirmService) {}

  accept() {
    this.confirmService.accept();
  }

  cancel() {
    this.confirmService.cancel();
  }
}
