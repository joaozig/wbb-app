import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';

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
    public events: Events,
    public betService: BetService) {

    this.util = Util;
    betService.getCurrentBet().then((bet) => {
      this.bet = bet;
    });
  }
}
