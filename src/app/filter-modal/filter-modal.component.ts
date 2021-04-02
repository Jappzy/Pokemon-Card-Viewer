import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {

  @Input() filters: any[];

  constructor(private modalController: ModalController) { }

  get disableClose() {
    return !this.filters.find(x => x[this.label(x)]);
  }

  label(filter) {
    return Object.keys(filter)[0];
  }

  close() {
    this.modalController.dismiss({
      filters: this.filters
    });
  }

}
