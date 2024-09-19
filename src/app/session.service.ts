import { Injectable } from '@angular/core';
import { SessionData } from './model/session-data';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public saveData(newData: SessionData): void {
    this.storeSessionData(newData);
  }
  
  public getData(): SessionData | null {
    return this.retrieveSessionData();
  }

  public logout(): void {
    this.initSessionData();
  }

  public isAuth(): boolean {
    return this.retrieveSessionData()?.uid !== undefined;
  }

  public initSessionData(): void {
    let init: SessionData = {
      uid: undefined,
      credits: 0,
      packs: 0
    };
    this.storeSessionData(init);
  }

  private storeSessionData(data: SessionData): void {
    sessionStorage.setItem('afse', JSON.stringify(data));
  }

  private retrieveSessionData(): SessionData | null {
    const stored = sessionStorage.getItem('afse');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }
}
