import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Events } from 'ionic-angular';

import { Util } from '../../app/util';

import { BetPage } from '../bet/bet';

import { BetService } from '../bet/bet.service';

@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
  providers: [BetService]
})
export class TicketsPage {

  util: any = Util;
  bet: any;
  user: any;
  game: any;
  loading: Boolean;
  shownGroup: any;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public betService: BetService) {

    this.bet = navParams.get('bet');
    this.user = navParams.get('user');
    this.game = navParams.get('game');
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

	addTicketToBet(ticket, ticketType) {
    if (!this.bet) {
      this.navCtrl.push(BetPage);
    } else {
      ticket.ticketType = {name: ticketType.name};
      ticket.ticketType.game = JSON.parse(JSON.stringify(this.game));

      this.betService.addTicket(ticket).then((bet) => {
        this.events.publish('bet:created', bet);
        this.navCtrl.pop();
      }, (errorMessage) => {
        this.alertCtrl.create({
          title: 'Algo falhou :(',
          message: errorMessage,
          buttons: ['OK']
        }).present();
      });
    }
  }
}
