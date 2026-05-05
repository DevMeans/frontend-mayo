import { Component, OnInit } from '@angular/core';
import { CategoryModalComponent } from '../../components/category-modal/category-modal.component';


@Component({
  selector: 'app-category-admin-page',
  templateUrl: './category-admin-page.component.html',
  styleUrls: ['./category-admin-page.component.css'],
  standalone: true,
  imports: [CategoryModalComponent]
})
export class CategoryAdminPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openModal() {
    console.log('Opening modal');
    const modal = document.getElementById('category-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }


}
