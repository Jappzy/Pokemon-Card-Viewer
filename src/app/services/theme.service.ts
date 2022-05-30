import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Subject } from 'rxjs';
import { Theme } from '../types';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  dark$: Subject<boolean> = new Subject();

  constructor() { }

  async getTheme() {
    const { value } = await Storage.get({ key: 'theme' });
    return JSON.parse(value);
  }

  async saveTheme(theme: Theme) {
    this.applyTheme(theme);
    await Storage.set({
      key: 'theme',
      value: JSON.stringify(theme)
    });
  }

  async getDarkMode() {
    const { value } = await Storage.get({ key: 'darkMode' });
    return !!value;
  }

  async saveDarkMode(enabled: boolean) {
    await Storage.set({
      key: 'darkMode',
      value: enabled ? 'enabled' : ''
    });
    this.dark$.next(enabled);
  }

  applyTheme({ hex, rgb, shade, tint }: Theme) {
    document.documentElement.style.setProperty('--ion-color-primary', hex);
    document.documentElement.style.setProperty('--ion-color-primary-rgb', rgb);
    document.documentElement.style.setProperty('--ion-color-primary-shade', shade);
    document.documentElement.style.setProperty('--ion-color-primary-tint', tint);
  }
}
