import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';

import { Util } from '../../app/util';

import { HomePage } from '../home/home';
import { CurrentBetPage } from '../current-bet/current-bet';
import { BetService } from './bet.service';

@Component({
  selector: 'page-bet',
  templateUrl: 'bet.html',
  providers: [BetService]
})
export class BetPage {

  util: any;
  bet: any;
  player: any = {name: '', betAmount: ''};

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public events: Events,
    public betService: BetService) {

    this.util = Util;
    betService.getCurrentBet().then((bet) => {
      this.bet = bet;
    });

    events.subscribe('bet:created', (bet) => {
      this.bet = bet;
    });

    events.subscribe('bet:removed', () => {
      this.bet = null;
    });
  }

  createBet() {
    this.betService.addBet(this.player.name, this.player.betAmount)
      .then((bet) => {
        this.bet = bet;
        if(this.navCtrl.length() == 1) {
          this.events.publish('root:change', HomePage);
        } else {
          this.events.publish('bet:created', bet);
          this.navCtrl.pop();
        }
      }, (errorMessage) => {
        this.alertCtrl.create({
          title: 'Algo falhou :(',
          message: errorMessage,
          buttons: ['OK']
        }).present();
      });
  }

  removeBet() {
    this.alertCtrl.create({
      title: 'Excluir Aposta',
      message: 'Deseja realmente excluir a aposta?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'OK',
          handler: () => {
            this.betService.removeBet().then(() => {
              this.bet = null;
              this.player.name = '';
              this.player.betAmount = '';
              this.events.publish('bet:removed');
            });
          }
        }
      ]
    }).present();
  }

  goToCurrentBet() {
    this.navCtrl.push(CurrentBetPage);
  }
}
