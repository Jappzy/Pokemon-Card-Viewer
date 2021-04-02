import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CardService } from '../services/card.service';
import { ApiResponse, Card } from '../types';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

  card: any;
  relatedCards$: Observable<Card[]>;
  saved: boolean;
  savedCards: Card[];
  showRelated: boolean;

  constructor(private route: ActivatedRoute, private cardService: CardService) { }

  ngOnInit() {
    this.card = history?.state?.data;

    if (!this.card) {
      this.route.paramMap.pipe(
        map(params => params.get('id')),
        switchMap(id => this.cardService.getCard(id))
      )
      .subscribe(({ data }: ApiResponse) => {
        this.card = data;
        this.savedCards = this.cardService.saved.value;
        this.saved = !!this.savedCards.find(card => card.id === this.card.id);
      });
    } else {
      this.savedCards = this.cardService.saved.value;
      this.saved = !!this.savedCards.find(card => card.id === this.card.id);
    }
  }

  async save() {
    this.saved = !this.saved;
    if (this.saved) {
      await this.cardService.saveCard(this.card);
    } else {
      await this.cardService.unSaveCard(this.card);
    }
  }

  loadRelated() {
    this.showRelated = true;
    this.relatedCards$ = this.cardService
      .search(this.card.evolvesFrom?.split(' ')[0] || this.card.name.split(' ')[0])
      .pipe(map((res: ApiResponse) => res.data));
  }

}
