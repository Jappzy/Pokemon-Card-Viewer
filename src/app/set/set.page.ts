import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { CardService } from '../services/card.service';
import { Card, Set, RaritiesList } from '../types';

@Component({
  selector: 'app-set',
  templateUrl: './set.page.html',
  styleUrls: ['./set.page.scss'],
})
export class SetPage implements OnInit {

  setCards$: Observable<Card[]>;
  set: Set;
  loadedImages: any = {};
  showPrice: boolean = false;
  showRarityPopover: boolean = false;
  sort: 'number' | 'price' = 'number';
  filteredCardCount: number;

  sortChange$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  filters$: BehaviorSubject<any> = new BehaviorSubject({});
  disabledFilters: boolean;
  rarityOptions: string[];
  rarityOptionsSelection: any = {};

  randy: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService
  ) { }

  ngOnInit() {

    this.randy = `${Math.random() * 100}`.substring(0, 2);

    this.showPrice = localStorage.getItem('showPrice') === 'true';
    this.sort = localStorage.getItem('cardSort') === 'number' ? 'number' : 'price';

    const getCards$ = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.cardService.getSet(id)),
        tap((cards: Card[]) => {

          if (!cards?.length) {
            return this.router.navigateByUrl('/')
          }

          this.set = cards[0].set;
          const filters = cards.reduce((acc, val) => {
            if (!acc.find(x => x[val.rarity])) acc.push({ [val.rarity]: true });
            return acc;
          }, []);
          this.disabledFilters = filters.length < 2;

          this.rarityOptionsSelection = {};       
          filters.forEach(f => this.rarityOptionsSelection[Object.keys(f)[0]] = true);

          this.rarityOptions = RaritiesList.filter(x => this.rarityOptionsSelection[x] !== undefined);

          this.filters$.next(this.rarityOptionsSelection);
        })
      );

    this.setCards$ = combineLatest([ getCards$, this.sortChange$, this.filters$ ])
      .pipe(
        map(([ cards, sort, filters ]) => {

          const filteredCards = cards.filter(card => filters[card.rarity]);

          this.filteredCardCount = filteredCards.length;

          return this.sort === 'price'
            ? filteredCards.sort((a, b) => this.priceLabel(b) - this.priceLabel(a))
            : filteredCards.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10))
        })
      );

  }

  imageLoaded(id: string) {
    this.loadedImages[id] = true;
  }

  toggleRarityPopover() {
    this.showRarityPopover = !this.showRarityPopover;
  }

  rarityFilterChange(rarity: string) {
    this.rarityOptionsSelection[rarity] = !this.rarityOptionsSelection[rarity];
    this.filters$.next(this.rarityOptionsSelection);
  }

  changeSort() {
    this.sort = this.sort === 'price' ? 'number' : 'price';
    this.sortChange$.next([]);
    localStorage.setItem('cardSort', this.sort);
  }

  priceLabel(card: Card) {
    if (card.tcgplayer?.prices) {
      const prices = card.tcgplayer.prices;
      const key = Object.keys(prices)[0];
      if (!key) return 0;
      return prices[key].market;
    } else if (card.cardmarket?.prices) {
      return card.cardmarket.prices.averageSellPrice;
    } else {
      return 0;
    }
  }

  togglePrice() {
    this.showPrice = !this.showPrice;
    localStorage.setItem('showPrice', `${this.showPrice}`);
  }

}
