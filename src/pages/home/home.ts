import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';

import { LoginService } from '../login/login.service';
import { BetService } from '../bet/bet.service';
import { GameService } from './game.service';

import { BetPage } from '../bet/bet';
import { TicketsPage } from '../tickets/tickets';

import { CONFIG } from '../../app/constants';
import { Util } from '../../app/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [LoginService, BetService, GameService]
})
export class HomePage {

  bet: any;
  user: any;
  championships: Array<any> = [];
  util: any = Util;
  loading: Boolean;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public events: Events,
    public loginService: LoginService,
    public betService: BetService,
    public gameService: GameService) { }

  ionViewDidLoad() {
    this.loading = true;
    this.loginService.getLoggedUser().then((user) => {
      this.user = user;
      this.events.publish('user:loaded');
    });

    this.betService.getCurrentBet().then((bet) => {
      this.bet = bet;
    });

    this.events.subscribe('bet:changed', (bet, updateData=true) => {
      this.bet = bet;
      if(updateData) {
        this.updatePageData();
      }
    });

    this.events.subscribe('bet:ticket-added',
      (ticket, game, championship, gameIndex, championshipIndex, ticketTypeName) => {
        this.addTicketToBet(ticket, game, championship, gameIndex, championshipIndex, ticketTypeName);
    });

    this.events.subscribe('user:loaded', () => {
      this.gameService.getChampionships(CONFIG.sportId, this.user.id_group)
        .then((championships) => {
          if(championships && championships.length > 0) {
            this.championships = championships;
            this.toggleGroup(this.championships[0]);
          }
          this.updatePageData();
          this.loading = false;
        }, error => {
          this.alertCtrl.create({
            title: 'Algo falhou :(',
            message: error,
            buttons: ['OK']
          }).present();
        });
    });
  }

  toggleGroup(group) {
    group.show = !group.show;
  }

  isGroupShown(group) {
    return group.show;
  }

  seeMoreTickets(game, gameIndex, championship, championshipIndex) {
    this.navCtrl.push(TicketsPage, {
      bet: this.bet,
      user: this.user,
      game: game,
      championship: championship,
      gameId: game.id,
      sportId: CONFIG.sportId,
      countryId: championship.country.id,
      gameIndex: gameIndex,
      championshipIndex: championshipIndex
    });
  }

  addTicketToBet(ticket, game, championship, gameIndex, championshipIndex, ticketTypeName=null) {
    if (!this.bet) {
      this.navCtrl.push(BetPage);
    } else {
      game.championship = JSON.parse(JSON.stringify(championship));
      if(ticketTypeName) {
        ticket.ticketType = {name: ticketTypeName}
      } else {
        ticket.ticketType = {name: game.ticketType[0].name};
      }
      ticket.ticketType.game = JSON.parse(JSON.stringify(game));
      this.betService.addTicket(ticket).then((bet) => {
        this.championships[championshipIndex].games[gameIndex].alreadyAdded = true;
        this.championships[championshipIndex].games[gameIndex].currentTicket = ticket;
        this.events.publish('bet:changed', bet, false);
      }, (errorMessage) => {
        this.alertCtrl.create({
          title: 'Algo falhou :(',
          message: errorMessage,
          buttons: ['OK']
        }).present();
      });
    }
  }

  updatePageData() {
    let championships = this.championships;
		if(championships) {

      for(var i = 0; i < championships.length; i++) {
        var championship = championships[i];
				championship.games = championship.games.map((game) => {
          var ticket = this.betService.getTicketByGameFromBet(this.bet, game);
					if (ticket) {
            ticket.ticketType = {name: game.ticketType[0].name};
            ticket.ticketType.game = JSON.parse(JSON.stringify(game));
						game.currentTicket = ticket;
						game.alreadyAdded = true;
					} else {
						game.alreadyAdded = false;
					}

					return game;
        });
        this.championships[i] = championship;
      }
		}
	}
}
