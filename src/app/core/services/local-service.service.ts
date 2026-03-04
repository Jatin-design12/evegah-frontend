import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../constants/common-constant';

@Injectable({
  providedIn: 'root'
})
export class LocalServiceService {

  constructor() { }
  key = SECRET_KEY;

// Save for Local Storage
  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }
  // Save for Session Storage
  public saveDataSession(key: string, value: string) {
    sessionStorage.setItem(key, this.encrypt(value));
  }

  // get Data for LocalStorage
  public getData(key: string) {
    let data = localStorage.getItem(key)|| "";
    return this.decrypt(data);
  }

  // get Data for SessionStorage
  public getDataSession(key: string) {
    let data = sessionStorage.getItem(key)|| "";
    return this.decrypt(data);
  }

// removeData For local
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  // removeData For session
  public removeDataSession(key: string) {
    sessionStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}
