import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { CardService } from '../services/card.service';
import { map } from 'rxjs/operators';
import { Set } from '../types';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.page.html',
  styleUrls: ['./sets.page.scss'],
})
export class SetsPage implements OnInit {

  sets$: Observable<Set[]>;
  reverse: boolean;
  reverse$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private cardService: CardService) { }

  ngOnInit() {
    this.sets$ = combineLatest([
      this.cardService.getSets().pipe(map((res: any) => res.data.reverse())),
      this.reverse$
    ])
    .pipe(
      map(([cards, reverse]) => cards.reverse())
    );
  }

  reorder() {
    this.reverse = !this.reverse;
    this.reverse$.next(this.reverse);
  }

}
