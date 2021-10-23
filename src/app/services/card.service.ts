import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse, Card } from '../types';

import * as base1 from '../../assets/sets/base1.json';
import * as base2 from '../../assets/sets/base2.json';
import * as base3 from '../../assets/sets/base3.json';
import * as base4 from '../../assets/sets/base4.json';
import * as base5 from '../../assets/sets/base5.json';
import * as base6 from '../../assets/sets/base6.json';
import * as basep from '../../assets/sets/basep.json';
import * as gym1 from '../../assets/sets/gym1.json';
import * as gym2 from '../../assets/sets/gym2.json';

import * as neo1 from '../../assets/sets/neo1.json';
import * as neo2 from '../../assets/sets/neo2.json';
import * as neo3 from '../../assets/sets/neo3.json';
import * as neo4 from '../../assets/sets/neo4.json';
import * as sil from '../../assets/sets/sil.json';

import * as swsh4 from '../../assets/sets/swsh4.json';
import * as swsh5 from '../../assets/sets/swsh5.json';
import * as swsh45 from '../../assets/sets/swsh45.json';
import * as swsh45sv from '../../assets/sets/swsh45sv.json';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CardService {

  baseUrl = environment.cardBaseUrl;
  apiKey = environment.cardApiKey;

  saved: BehaviorSubject<any[]>;

  constructor(private http: HttpClient) { }

  getCard(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/cards/${id}`, { headers: { 'X-Api-Key': this.apiKey }});
  }

  getSets(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/sets?orderBy=releaseDate`, { headers: { 'X-Api-Key': this.apiKey }});
  }

  getSet(id: string): Observable<ApiResponse> {

    switch(id) {
      case 'base1':
        return of((base1 as any).default);
      case 'base2':
        return of((base2 as any).default);
      case 'base3':
        return of((base3 as any).default);
      case 'base4':
        return of((base4 as any).default);
      case 'base5':
        return of((base5 as any).default);
      case 'base6':
        return of((base6 as any).default);
      case 'basep':
        return of((basep as any).default);
      case 'gym1':
        return of((gym1 as any).default);
      case 'gym2':
        return of((gym2 as any).default);

      case 'neo1':
        return of((neo1 as any).default);
      case 'neo2':
        return of((neo2 as any).default);
      case 'neo3':
        return of((neo3 as any).default);
      case 'neo4':
        return of((neo4 as any).default);
      case 'sil':
        return of((sil as any).default);

      case 'swsh4':
        return of((swsh4 as any).default);
      case 'swsh5':
        return of((swsh5 as any).default);
      case 'swsh45':
        return of((swsh45 as any).default);
      case 'swsh45sv':
        return of((swsh45sv as any).default);

      default:
        return this.http.get<ApiResponse>(`${this.baseUrl}/cards?q=set.id:${id}`, { headers: { 'X-Api-Key': this.apiKey }});

    }

  }

  search(term: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/cards?q=name:"${term}*"&pageSize=20`, { headers: { 'X-Api-Key': this.apiKey }});
  }

  setSaved(cards: Card[] = []) {
    this.saved = new BehaviorSubject(cards);
  }

  async saveCard(card: Card) {
    const storage = await Storage.get({ key: 'savedCards' });
    const savedCards = JSON.parse(storage.value) || [];
    if (savedCards.find(x => x.id === card.id)) return;
    savedCards.push(card);
    await Storage.set({ key: 'savedCards', value: JSON.stringify(savedCards) });
    this.saved.next(savedCards);
  }

  async unSaveCard({ id }: Card) {
    let cards = this.saved.value;
    cards = cards.filter(x => x.id !== id);
    await Storage.set({ key: 'savedCards', value: JSON.stringify(cards) });
    this.saved.next(cards);
  }

  async getSavedCards() {
    const storage = await Storage.get({ key: 'savedCards' });
    const savedCards = JSON.parse(storage.value) || [];
    return savedCards;
  }
}
