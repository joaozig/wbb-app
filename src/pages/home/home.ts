import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { LoginService } from '../login/login.service';
import { BetService } from '../bet/bet.service';
import { GameService } from './game.service';

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

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public loginService: LoginService,
    public betService: BetService,
    public gameService: GameService) {

    loginService.getLoggedUser().then((user) => {
      this.user = user;
      events.publish('user:loaded');
    });

    betService.getCurrentBet().then((bet) => {
      this.bet = bet;
    });

    events.subscribe('user:loaded', () => {
      this.gameService.getChampionships(CONFIG.sportId, this.user.id_group)
        .then((championships) => {
          this.championships = championships;
        }, error => {
          console.log(error);
        });
    });
  }
}
