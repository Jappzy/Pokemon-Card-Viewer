import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/card.service';
import { Card, Theme, Themes } from '../types';
import { ModalController } from '@ionic/angular';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { ThemeService } from '../services/theme.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  theme: Theme;

  themeOptions = Object.keys(Themes).map((key: string) => (
    { label: Themes[key].label, value: Themes[key].label }
  ));

  saved$: Observable<Card[]>;

  nothingSaved: boolean;

  darkMode: boolean;

  constructor(
    private cardService: CardService,
    private themeService: ThemeService,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    const theme = await this.themeService.getTheme();
    this.theme = theme?.label || 'Sapphire';
    this.darkMode = await this.themeService.getDarkMode();
    this.saved$ = this.cardService.saved.asObservable()
      .pipe(tap(cards => this.nothingSaved = !cards || !cards.length));
  }

  onSelect(event: any) {
    const { value } = event.detail;
    const theme = Themes[value];
    this.updateTheme(theme);
  }

  async toggleDarkMode() {
    const enabled = document.body.classList.toggle('dark');
    await this.themeService.saveDarkMode(enabled);
  }

  async updateTheme(theme: Theme) {
    if (!theme.hex) return;
    await this.themeService.saveTheme(theme);
  }

  async openInfoModal() {
    const modal = await this.modalController.create({ component: InfoModalComponent });
    await modal.present();
  }

}
