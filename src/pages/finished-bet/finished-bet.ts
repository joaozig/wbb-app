import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Events } from 'ionic-angular';

import { Util } from '../../app/util';

import { BetService } from '../bet/bet.service';

@Component({
  selector: 'page-finished-bet',
  templateUrl: 'finished-bet.html',
  providers: [BetService]
})
export class FinishedBetPage {

  util: any = Util;
  bet: any;
  loading: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public events: Events,
    public betService: BetService) {

    this.bet = navParams.get('bet');
    this.betService.getFinishedBet(this.bet.hash).then((bet) => {
      this.bet = bet;
      console.log(this.bet);
      this.loading = false;
    }, (errorMessage) => {
      this.alertCtrl.create({
        title: 'Algo falhou :(',
        message: errorMessage,
        buttons: ['OK']
      }).present();
    });
  }

	cancelBet() {
    this.alertCtrl.create({
      title: 'Excluir Aposta',
      message: 'Você deseja realmente cancelar a aposta?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'OK',
          handler: () => {
            this.betService.cancelBet(this.bet.hash).then((data) => {
              if(data.user.success) {
                this.events.publish('bet:cancelled');
                this.navCtrl.pop();
              } else {
                this.alertCtrl.create({
                  title: 'Algo falhou :(',
                  message: data.user.message,
                  buttons: ['OK']
                }).present();
              }
            }, (errorMessage) => {
              this.alertCtrl.create({
                title: 'Algo falhou :(',
                message: errorMessage,
                buttons: ['OK']
              }).present();
            });
          }
        }
      ]
    }).present();
	}

  getColorStatus(status) {
		if(status.toLowerCase() == 'errou'){
			return 'red';
		} else if(status.toLowerCase() == 'pendente' || status.toLowerCase() == 'cancelado' || status.toLowerCase() == 'adiado' || status.toLowerCase() == 'sem resultado') {
			return 'orange';
		} else {
			return 'green';
		}
	}
}