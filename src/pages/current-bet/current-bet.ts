import { Component } from '@angular/core';
import { 
  NavController, 
  AlertController, 
  ModalController,
  Events } from 'ionic-angular';

import { Util } from '../../app/util';

import { EditBetPage } from './edit-bet';

import { BetService } from '../bet/bet.service';

@Component({
  selector: 'page-current-bet',
  templateUrl: 'current-bet.html',
  providers: [BetService]
})
export class CurrentBetPage {

  util: any;
  bet: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public events: Events,
    public betService: BetService) {

    this.util = Util;
    betService.getCurrentBet().then((bet) => {
      this.bet = bet;
    });

    events.subscribe('bet:changed', (bet) => {
      this.bet = bet;
    });
  }

  editBet() {
    this.modalCtrl.create(EditBetPage, {bet: this.bet}).present();
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
              this.events.publish('bet:changed', null);
              this.navCtrl.pop();
            });
          }
        }
      ]
    }).present();
  }
}