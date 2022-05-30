import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ApiResponse, Card, Set } from '../types';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CardService {

  baseUrl = environment.cardBaseUrl;
  apiKey = environment.cardApiKey;
  headers = { headers: { 'X-Api-Key': this.apiKey } };

  saved: BehaviorSubject<any[]>;

  constructor(private http: HttpClient) { }

  getCard(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/cards/${id}`, this.headers);
  }

  getSets(): Observable<Set[]> {
    return this.http
      .get<ApiResponse>(`${this.baseUrl}/sets?orderBy=releaseDate`, this.headers)
      .pipe(
        map((res: ApiResponse) => res.data)
      );
  }

  getRarities(): Observable<any[]> {
    return this.http
      .get<ApiResponse>(`${this.baseUrl}/rarities`, this.headers)
      .pipe(
        map((res: ApiResponse) => res.data)
      );
  }

  getSet(id: string): Observable<Card[]> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/cards?q=set.id:${id}&page=1&pageSize=250`, this.headers)
      .pipe(
        switchMap((res: ApiResponse) => {
          const { data } = res;

          if (res.count < res.totalCount && res.page == 1) {
            // get next page and add to end of data
            return this.http.get<ApiResponse>(`${this.baseUrl}/cards?q=set.id:${id}&page=2&pageSize=250`, this.headers)
              .pipe(
                map(page2 => [ ...data, ...page2.data ])
              );
          } else {
            return of(data);
          }
        })
      );
  }

  search(term: string): Observable<Card[]> {
    return this.http
      .get<ApiResponse>(`${this.baseUrl}/cards?q=name:"${term}*"&pageSize=20`, this.headers)
      .pipe(
        map((res: ApiResponse) => res.data)
      );
  }

  /* Deprecated save functionality */

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
