import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  ModalController,
  Events } from 'ionic-angular';

import { Util } from '../../app/util';

import { EditBetPage } from './edit-bet';
import { FinishedBetPage } from '../finished-bet/finished-bet';

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
    public modalCtrl: ModalController,
    public events: Events,
    public betService: BetService) {

    this.util = Util;
    betService.getCurrentBet().then((bet) => {
      this.bet = bet;
    });

    events.subscribe('bet:changed', (bet) => {
      this.bet = bet;
    });
  }

  editBet() {
    this.modalCtrl.create(EditBetPage, {bet: this.bet}).present();
  }

	finishBet() {
    this.alertCtrl.create({
      title: 'Finalizar Aposta',
      message: 'Você deseja realmente finalizar a aposta?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'OK',
          handler: () => {
            this.betService.finishBet().then((response) => {
              if (response.success) {
                this.betService.removeBet().then(() => {
                  this.events.publish('bet:changed', null);
                  this.navCtrl.push(FinishedBetPage, {
                    hash: response.bet,
                    currentBet: true
                  });
                });
              } else {
                this.alertCtrl.create({
                  title: 'Algo falhou :(',
                  message: response.message,
                  buttons: ['OK']
                }).present();

                if (response.tickets) {
                  this.betService.removeInvalidTickets(response.tickets)
                    .then((bet) => {
                      this.events.publish('bet:changed', bet);
                    });
                }
              }
            }, (errorMessage) => {
              this.alertCtrl.create({
                title: 'Algo falhou :(',
                message: 'Não foi possível finalizar a aposta',
                buttons: ['OK']
              }).present();
            });
          }
        }
      ]
    }).present();
	}

  removeBet() {
    this.alertCtrl.create({
      title: 'Excluir Aposta',
      message: 'Deseja realmente excluir a aposta?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'OK',
          handler: () => {
            this.betService.removeBet().then(() => {
              this.bet = null;
              this.events.publish('bet:changed', null);
              this.events.publish('bet:removed', null);
              this.navCtrl.pop();
            });
          }
        }
      ]
    }).present();
  }

  removeTicket(ticketId) {
    this.alertCtrl.create({
      title: 'Remover Palpite',
      message: 'Você deseja realmente remover o palpite da aposta?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'OK',
          handler: () => {
            this.betService.removeTicket(ticketId).then((bet) => {
              this.events.publish('bet:changed', bet);
            }, () => {
              this.alertCtrl.create({
                title: 'Algo falhou :(',
                message: 'Não foi possível remover o palpite da aposta',
                buttons: ['OK']
              }).present();
            });
          }
        }
      ]
    }).present();
  }
}