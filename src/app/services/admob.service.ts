import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { AdOptions, AdSize, AdPosition } from '@capacitor-community/admob';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

const { AdMob } = Plugins;

const {
  androidBannerAdId,
  iosBannerAdId,
  androidInterstitialAdId,
  iosInterstitialAdId,
  testBannerAdId,
  testInterstitialAdId
} = environment;

@Injectable({
  providedIn: 'root'
})
export class AdmobService {

  bannerOptions = {
    android: {
      adId: androidBannerAdId,
      // adId: testBannerAdId,
      adSize: AdSize.BANNER,
      position: AdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: false
    },
    ios: {
      // adId: iosBannerAdId,
      adId: testBannerAdId,
      adSize: AdSize.BANNER,
      position: AdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
    }
  };

  interstitialOptions = {
    android: {
      adId: androidInterstitialAdId
      // adId: testInterstitialAdId
    },
    ios: {
      // adId: iosInterstitialAdId
      adId: testInterstitialAdId
    }
  };

  bannerInitialized: boolean;
  platform: 'android' | 'ios';
  actionCount = 0;
  routerSub: Subscription;

  constructor(private router: Router) { }

  initialize(platform: 'android' | 'ios') {
    this.platform = platform;

    AdMob.initialize();

    this.routerSub = this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd) {
        const urlRegex = new RegExp('tabs');
        if (!urlRegex.test(event.url) && event.url !== '/') {
          this.actionCount++;
          if (this.actionCount % 23 === 0) {
            await this.showInterstitial();
          }
          this.showBannerAd();
        } else {
          this.hideBannerAd();
        }
      }
    });
  }

  showBannerAd() {
    if (!this.bannerInitialized) {
      AdMob.showBanner(this.bannerOptions[this.platform]);
      this.bannerInitialized = true;
    } else {
      AdMob.resumeBanner();
    }
  }

  hideBannerAd() {
    if (this.bannerInitialized) {
      AdMob.hideBanner();
    }
  }

  async showInterstitial() {
    await AdMob.prepareInterstitial(this.interstitialOptions[this.platform]);
    await AdMob.showInterstitial();
  }
}
