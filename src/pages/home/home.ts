import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { BetService } from '../bet/bet.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BetService]
})
export class HomePage {

  bet: any;

  constructor(
    public navCtrl: NavController,
    public betService: BetService) {

    this.betService.getCurrentBet().then((bet) => {
      this.bet = bet;
    });
  }

}
