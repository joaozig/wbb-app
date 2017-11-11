import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Events } from 'ionic-angular';

import { Util } from '../../app/util';

import { PrintPage } from '../print/print';

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

    // removes CurrentBetPage from stack
    let previousPage = this.navCtrl.last().component.name;
    if (previousPage == 'CurrentBetPage') {
      navCtrl.remove(navCtrl.length() - 1);
    }

    let hash = navParams.get('hash');
    this.betService.getFinishedBet(hash).then((bet) => {
      this.bet = bet;
      this.loading = false;
    }, (errorMessage) => {
      this.alertCtrl.create({
        title: 'Algo falhou :(',
        message: errorMessage,
        buttons: ['OK']
      }).present();
    });
  }

  printBet() {
    this.navCtrl.push(PrintPage, {bet: this.bet});
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