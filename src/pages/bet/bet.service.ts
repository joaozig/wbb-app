import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { API_URL } from '../../app/constants';
import { Bet } from './bet.model';

@Injectable()
export class BetService {

  static betKey = 'bet';
  static minBetAmount = 2;
  static maxBetAmount = 150;

  constructor(public http: Http, public storage: Storage) { }

  addBet(playerName, betAmount): Promise<any> {
    return new Promise((resolve, reject) => {

      let validation = this._validateBet(playerName, betAmount);
      if(validation.valid) {
        let bet = new Bet({
          playerName: playerName,
          betAmount: betAmount
        });
        this._saveBet(bet);
        resolve(bet);
      } else {
        reject(validation.message);
      }
    });
  }

	editBet(playerName, betAmount): Promise<any> {
    return new Promise((resolve, reject) => {
      let validation = this._validateBet(playerName, betAmount);
      if(validation.valid) {
        this.getCurrentBet().then((bet) => {
          bet.playerName = playerName;
          bet.betAmount = betAmount;
          this._saveBet(bet);
          resolve(bet);
        });
      } else {
        reject(validation.message);
      }
    });
	}

  getCurrentBet(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get(BetService.betKey).then((bet) => {
        if(bet) {
          resolve(new Bet(bet));
        }
      });
    });
  }

  removeBet(): Promise<any> {
    return this.storage.remove(BetService.betKey);
  }

  /** Private Methods  **/

  private _validateBet(playerName, betAmount) {
		betAmount = parseFloat(betAmount);
		var validation = {valid: false, message: 'Falha ao adicionar aposta'};
		if(!playerName) {
      validation.message = 'Preencha o nome do apostador';

		} else if(isNaN(betAmount)) {
      validation.message = 'Preencha o valor a ser apostado';

    } else if(betAmount < BetService.minBetAmount
      || betAmount > BetService.maxBetAmount) {

      validation.message = 'O valor a ser apostado tem que ser no mínimo ';
      validation.message += BetService.minBetAmount + ' e no máximo ';
      validation.message += + BetService.maxBetAmount + ' reais';

		} else {
			validation.valid = true;
			validation.message = 'Aposta válida';
		}

		return validation;
  }

  private _saveBet(bet) {
    this.storage.set(BetService.betKey, bet);   
  }
}