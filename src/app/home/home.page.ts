import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardService } from '../services/card.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  cards: ({ image: string; link: string; })[] = [
    { image: 'https://images.pokemontcg.io/ecard3/H11.png', link: '' },
    { image: 'https://images.pokemontcg.io/swsh9/154.png', link: '' },
    { image: 'https://images.pokemontcg.io/swsh8/245.png', link: '' },
    { image: 'https://images.pokemontcg.io/base3/4.png', link: '' },
    { image: 'https://images.pokemontcg.io/neo1/9.png', link: '' },
    { image: 'https://images.pokemontcg.io/ex13/102.png', link: '' },
    { image: 'https://images.pokemontcg.io/base5/83.png', link: '' },
    { image: 'https://images.pokemontcg.io/xy6/75.png', link: '' },
  ];

  dark: boolean;
  darkSub: Subscription;

  constructor(
    private theme: ThemeService,
    private router: Router,
    private cardService: CardService
  ) { }

  async ngOnInit() {
    this.dark = await this.theme.getDarkMode();
    this.darkSub = this.theme.dark$.subscribe(dark => this.dark = dark);
  }

  ngOnDestroy() {
    this.darkSub.unsubscribe();
  }

  async navigateToRandomSet() {
    const sets = await this.cardService.getSets().toPromise();
    const randy = Math.floor(Math.random() * sets.length);
    await this.router.navigateByUrl(`/set/${sets[randy].id}`);
  }

}
