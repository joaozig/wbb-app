import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { BetService } from './bet.service';

@Component({
  selector: 'page-bet',
  templateUrl: 'bet.html',
  providers: [BetService]
})
export class BetPage {

  bet: any;
  player: any = {name: '', betAmount: ''};

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public events: Events,
    public betService: BetService) {
    betService.getCurrentBet().then((bet) => {
      this.bet = bet;
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
}
