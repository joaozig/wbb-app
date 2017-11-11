import { Component, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { BetPage } from '../../pages/bet/bet';
import { CurrentBetPage } from '../../pages/current-bet/current-bet';

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
    if(this.bet) {
      this.navCtrl.push(CurrentBetPage);
    } else {
      this.navCtrl.push(BetPage);
    }
  }
}
