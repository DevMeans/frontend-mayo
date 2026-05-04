import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-admin-page',
  templateUrl: './category-admin-page.component.html',
  styleUrls: ['./category-admin-page.component.css']
})
export class CategoryAdminPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openModal() {
    console.log('Opening modal');
    const modal = document.getElementById('category-modal') as HTMLInputElement;
    if (modal) {
      modal.checked = true;
    }
  }


}
