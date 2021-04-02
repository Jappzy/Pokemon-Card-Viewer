import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AdmobService } from './services/admob.service';
import { CardService } from './services/card.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private themeService: ThemeService,
    private cardService: CardService,
    private adMobService: AdmobService,
    private platform: Platform
  ) {}

  async ngOnInit() {
    const darkMode = await this.themeService.getDarkMode();
    if (darkMode) document.body.classList.add('dark');

    const theme = await this.themeService.getTheme();
    if (theme) this.themeService.applyTheme(theme);

    const savedCards = await this.cardService.getSavedCards();
    this.cardService.setSaved(savedCards);

    await this.platform.ready();

    const isAndroid = this.platform.platforms().includes('android') && this.platform.platforms().includes('capacitor');
    const isIOS = this.platform.platforms().includes('ios') && this.platform.platforms().includes('capacitor');

    if (isAndroid) {
      this.adMobService.initialize('android');
    } else if (isIOS) {
      this.adMobService.initialize('ios');
    } else {
      console.log('no ads');
    }
  }
}
