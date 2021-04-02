import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { CardService } from '../services/card.service';
import { ApiResponse, Card } from '../types';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-set',
  templateUrl: './set.page.html',
  styleUrls: ['./set.page.scss'],
})
export class SetPage implements OnInit {

  set$: Observable<Card[]>;
  setName: string;
  loadedImages: any = {};

  filters$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  disabledFilters: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService,
    private modalController: ModalController
  ) { }

  ngOnInit() {

    const getCards$ = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.cardService.getSet(id)),
        map((res: ApiResponse) => res.data),
        tap((cards: Card[]) => {
          if (!cards?.length) {
            this.router.navigateByUrl('/tabs/sets')
          } else {
            this.setName = cards[0].set.name;
            const filters = cards.reduce((acc, val) => {
              if (!acc.find(x => x[val.rarity])) acc.push({ [val.rarity]: true });
              return acc;
            }, []);
            this.disabledFilters = filters.length < 2;
            this.filters$.next(filters);
          }
        })
      );

    this.set$ = combineLatest([ getCards$, this.filters$ ])
      .pipe(
        map(([ cards, filters ]) => {
          return cards.filter(card => filters.find(x => x[card.rarity]));
        })
      );

  }

  async openFilters() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: {
        filters: this.filters$.value
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    
    if (data?.filters) this.filters$.next(data.filters);
  }

  imageLoaded(id: string) {
    this.loadedImages[id] = true;
  }

}
