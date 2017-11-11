import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  NavParams,
  Events
} from 'ionic-angular';

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
  championship: any;
  loading: Boolean = true;
  shownGroup: any;
  gameIndex: any;
  championshipIndex: any;

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
    this.championship = navParams.get('championship');
    let sportId = navParams.get('sportId');
    let countryId = navParams.get('countryId');
    this.gameIndex = navParams.get('gameIndex');
    this.championshipIndex = navParams.get('championshipIndex');

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
      this.navCtrl.pop();
      this.events.publish(
        'bet:ticket-added',
        ticket,
        this.game,
        this.championship,
        this.gameIndex,
        this.championshipIndex,
        ticketType.name
      );
    }
  }
}
