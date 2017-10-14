import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Events } from 'ionic-angular';

import { Util } from '../../app/util';

import { BetPage } from '../bet/bet';

import { BetService } from '../bet/bet.service';
import { GameService } from '../home/game.service';

@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
  providers: [BetService, GameService]
})
export class TicketsPage {

  util: any = Util;
  bet: any;
  user: any;
  game: any;
  loading: Boolean = true;
  shownGroup: any;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public betService: BetService,
    public gameService: GameService) {

    this.bet = navParams.get('bet');
    let user = navParams.get('user');
    let game = navParams.get('game');
    let sportId = navParams.get('sportId');
    let countryId = navParams.get('countryId');

    this.gameService.getGame(game.id, sportId, countryId, user.id_group)
      .then((game) => {
        this.loading = false;
				this.game = game;
				this.toggleGroup(game.ticketType[0]);
			},(errorMessage) => {
        this.loading = false;
        this.alertCtrl.create({
          title: 'Algo falhou :(',
          message: errorMessage,
          buttons: ['OK']
        }).present();
			}
		);
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
