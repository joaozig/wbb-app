import { Component, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { BetPage } from '../../pages/bet/bet';

@Component({
  selector: 'bet-footer',
  templateUrl: 'bet-footer.html'
})
export class BetFooterComponent {
  @Input() bet: any = null;

  constructor(public navCtrl: NavController, public events: Events) {
    events.subscribe('bet:created', (bet) => {
      this.bet = bet;
    });

    events.subscribe('bet:removed', () => {
      this.bet = null;
    });
  }

  goToBet() {
    this.navCtrl.push(BetPage);
  }
}
