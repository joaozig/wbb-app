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
    public gameService: GameService) { }

  ngOnInit() {
    console.log('entrou aqui no constructor');
    this.loginService.getLoggedUser().then((user) => {
      this.user = user;
      console.log('entrou aqui');
      this.events.publish('user:loaded');
    });

    this.betService.getCurrentBet().then((bet) => {
      this.bet = bet;
    });

    this.events.subscribe('user:loaded', () => {
      this.gameService.getChampionships(CONFIG.sportId, this.user.id_group)
        .then((championships) => {
          this.championships = championships;
          this.toggleGroup(this.championships[0]);
        }, error => {
          console.log(error);
        });
    });
  }

  toggleGroup(group) {
    group.show = !group.show;
  }

  isGroupShown(group) {
    return group.show;
  }
}
