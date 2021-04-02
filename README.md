# Pokemon Cards App

View Pokemon cards by set or search for your favorites.

[App Store](https://pokecards-app.web.app) (in review)
<br/>

[Play Store](https://pokecards-app.web.app) (in review)
<br/>

[Website](https://pokecards-app.web.app)
<br/>

## Tools

Hybrid App built using [Ionic](https://ionicframework.com/docs/components), [Capacitor](https://capacitorjs.com), [Angular](https://angular.io), & [Firebase](https://console.firebase.google.com)

Data comes from the [Pokemon TCG Developers API](https://pokemontcg.io/)

## Features

- Tabs layout (home, search, user)
- Home page contains all of the sets
    - Re-order, common ones are static json instead of API request
- Search page hits the API
- User page contains settings and saved cards
    - Dark Mode, Theming, and Saved using Capacitor Storage
- Set view page lazy loads images and uses a placeholder until loaded
    - Includes filters for the different rarities in each set
- Card view page displays card info, pricing info, and the option to load related cards

### Ads

[Capacitor Community AdMob Plugin](https://github.com/capacitor-community/admob) is used for Banner & Interstitial Ads.

Banner Ads are shown on all non-tab pages, and Interstitial (full-screen pop-up) Ads are shown every 23 "major actions".
