import { Component } from '@angular/core';
import { 
  NavController, 
  AlertController, 
  ModalController,
  ViewController,
  NavParams, 
  Events } from 'ionic-angular';

import { Util } from '../../app/util';

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

    events.subscribe('bet:created', (bet) => {
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
              this.events.publish('bet:removed');
              this.navCtrl.pop();
            });
          }
        }
      ]
    }).present();
  }
}

@Component({
  selector: 'page-modal-edit-bet',
  templateUrl: 'modal-edit-bet.html',
  providers: [BetService]
})
export class EditBetPage {
  currentBet: any;
  player: any = {name: '', betAmount: ''};

  constructor(
    public params: NavParams,
    public events: Events,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public betService: BetService) {

    this.currentBet = params.get('bet');
    this.player.name = this.currentBet.playerName;
    this.player.betAmount = this.currentBet.betAmount;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editBet() {
    this.betService.editBet(this.player.name, this.player.betAmount)
      .then((bet) => {
				this.events.publish('bet:created', bet);
				this.dismiss();
			}, (errorMessage) => {
        this.alertCtrl.create({
          title: 'Algo falhou :(',
          message: errorMessage,
          buttons: ['OK']
        }).present();
      });
  }
}