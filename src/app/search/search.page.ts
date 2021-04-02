import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CardService } from '../services/card.service';
import { Card } from '../types';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {

  results$: Observable<Card[]>;

  constructor(private cardService: CardService) { }

  search(event: any) {
    const term = event.detail.value.trim();
    if (!term) {
      this.results$ = of([]);
      return;
    }
    this.results$ = this.cardService.search(term).pipe(map((res: any) => res.data));
  }

}
