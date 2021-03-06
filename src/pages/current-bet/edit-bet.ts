import { Component } from '@angular/core';
import {
  AlertController,
  ViewController,
  NavParams,
  Events } from 'ionic-angular';

import { BetService } from '../bet/bet.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'page-edit-bet',
  templateUrl: 'edit-bet.html',
  providers: [BetService, LoginService]
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
				this.events.publish('bet:changed', bet);
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