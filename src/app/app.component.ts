import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AdmobService } from './services/admob.service';
import { CardService } from './services/card.service';
import { ThemeService } from './services/theme.service';
import { Set } from './types';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  useImage: boolean = false;
  reverse: boolean = true;
  searchTerm: string;
  legality: string = 'unlimited';

  sets$: Observable<Set[]>;
  update$: BehaviorSubject<any> = new BehaviorSubject(null);

  seriesSelection: any = {};
  seriesOptions: any[];
  seriesOptionsReversed: any[];

  constructor(
    private themeService: ThemeService,
    private cardService: CardService,
    private adMobService: AdmobService,
    private platform: Platform,
    private swUpdates: SwUpdate,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const darkMode = await this.themeService.getDarkMode();
    if (darkMode) document.body.classList.add('dark');

    const theme = await this.themeService.getTheme();
    if (theme) this.themeService.applyTheme(theme);

    const savedCards = await this.cardService.getSavedCards();
    this.cardService.setSaved(savedCards);

    this.reverse = localStorage.getItem('reverse') === 'true';
    this.useImage = localStorage.getItem('useImage') === 'true';

    this.sets$ =
      combineLatest([
        this.cardService.getSets().pipe(
          tap((sets: Set[]) => {
            const seriesObj = {};
            sets.forEach(set => seriesObj[set.series] = true);
            this.seriesSelection = seriesObj;
            this.seriesOptions = Object.keys(seriesObj);
            this.seriesOptionsReversed = [...this.seriesOptions].reverse();
          })
        ),
        this.update$
      ])
      .pipe(
        map(([ sets ]) => {
          const reg = new RegExp(this.searchTerm, 'i');

          const filteredSets = sets.filter(({ name, series, legalities }: Set) => this.seriesSelection[series] && reg.test(name) && legalities[this.legality]);
        
          return this.reverse ? filteredSets.reverse() : filteredSets;
        })
      );

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

    this.handleServiceWorkerUpdates();
  }

  seriesChange(series: string) {
    this.seriesSelection[series] = !this.seriesSelection[series];
    this.update$.next(null);
  }

  legalityChange(event: any) {
    this.legality = event.detail.value;
    this.update$.next(null);
  }

  searchChange(e: any) {
    this.searchTerm = e.detail.value;
    this.update$.next(null);
  }

  toggleReverse() {
    this.reverse = !this.reverse;
    localStorage.setItem('reverse', `${this.reverse}`);
    this.update$.next(null);
  }

  toggleImageView() {
    this.useImage = !this.useImage;
    localStorage.setItem('useImage', `${this.useImage}`);
  }
  
  async toggleDarkMode() {
    const dark = await this.themeService.getDarkMode();
    await this.themeService.saveDarkMode(!dark);
    document.body.classList.toggle('dark');
  }

  handleServiceWorkerUpdates() {
    this.swUpdates.versionUpdates.subscribe(async (evt: VersionEvent) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          const toast = await this.toastController.create({
            message: 'Update Available',
            buttons: [
              {
                side: 'end',
                text: 'Ok',
                handler: async () => await this.toastController.dismiss()
              }
            ]
          });
          await toast.present();
          await toast.onDidDismiss();
          this.swUpdates.activateUpdate().then(() => document.location.reload());
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          break;
      }
    });
  }
}
