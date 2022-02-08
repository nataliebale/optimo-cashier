import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  set(key: string, value: any): void {
    try {
      if (typeof value !== 'string') {
        value = JSON.stringify(value);
      }
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key: string): any {
    try {
      let value: string = localStorage.getItem(key);
      try {
        value = JSON.parse(value);
      } catch {}
      return value;
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return undefined;
    }
  }

  remove(key: string): any {
    localStorage.removeItem(key);
  }
}
