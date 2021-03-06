import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { API_URL } from '../../app/constants';
import { Bet } from './bet.model';

import { LoginService } from '../login/login.service';

@Injectable()
export class BetService {

  static betKey = 'bet';
  static minBetAmount = 2;
  static maxBetAmount = 150;

  constructor(
    public http: Http,
    public storage: Storage,
    public loginService: LoginService) { }

  addBet(playerName, betAmount): Promise<any> {
    return new Promise((resolve, reject) => {

      let validation = this._validateBet(playerName, betAmount);
      if(validation.valid) {
        let bet = new Bet({
          playerName: playerName,
          betAmount: betAmount
        });
        this._saveBet(bet);
        resolve(bet);
      } else {
        reject(validation.message);
      }
    });
  }

	editBet(playerName, betAmount): Promise<any> {
    return new Promise((resolve, reject) => {
      let validation = this._validateBet(playerName, betAmount);
      if(validation.valid) {
        this.getCurrentBet().then((bet) => {
          bet.playerName = playerName;
          bet.betAmount = betAmount;
          this._saveBet(bet);
          resolve(bet);
        });
      } else {
        reject(validation.message);
      }
    });
	}

  getCurrentBet(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get(BetService.betKey).then((bet) => {
        if(bet) {
          resolve(new Bet(bet));
        }
      });
    });
  }

	getFinishedBet(hash): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = API_URL + '/includes/inc.getbets.php?hash=' + hash;

      this.http.get(url).map(res => res.json()).subscribe(response => {
        resolve(response);
      }, (error) => {
        reject('Não foi possível recuperar a aposta.');
      });
    });
  }

  removeBet(): Promise<any> {
    return this.storage.remove(BetService.betKey);
  }

  cancelBet(hash): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = API_URL + '/includes/inc.cancelbet.php?hash=' + hash;

      this.http.get(url).map(res => res.json()).subscribe(response => {
        resolve(response);
      }, (error) => {
        reject('Não foi possível recuperar a aposta.');
      });
    });
  }

	finishBet(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getCurrentBet().then((bet) => {
        if (bet) {
          this.loginService.getLoggedUser().then((user) => {
            bet.seller = user
            bet.date = new Date().toLocaleString('pt');
            var params = {
              id: bet.id,
              playerName: bet.playerName,
              seller: bet.seller.id,
              betAmount: bet.betAmount,
              jackpot: bet.jackpot(),
              tickets: bet.tickets,
              date: bet.date,
              groupId : bet.seller.id_group
            }

            params.tickets = params.tickets.map((t) => {
              return t.id+'#'+t.tax;
            });

            let url = API_URL + '/includes/inc.bets.php';
            let headers = new Headers();
            let data = 'playerName=' + params.playerName;
            data += '&seller=' + params.seller + '&betAmount=' + params.betAmount;
            data += '&jackpot=' + params.jackpot + '&groupId=' + params.groupId;
            data += '&tickets[]='+params.tickets;

            headers.append('Content-Type', 'application/x-www-form-urlencoded');

            this.http.post(url, data, {headers}).map(res => res.json())
              .subscribe(response => {
                resolve(response);
              }, (err) => {
                reject('Falha ao finalizar aposta');
              });
          });
        } else {
          reject('Nenhuma aposta ativa');
        }
      });
    });
	}

	addTicket(ticket): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getCurrentBet().then((bet) => {
        if(!this._validateTicketDate(ticket)){
          reject('Tempo esgotado para apostas nesse jogo.');
        } else if(!this._validateUniqueTicket(bet, ticket)) {
          reject('Você já escolheu um palpite para esse jogo.');
        } else {
          var newTicket = {
            id: ticket.id,
            name: ticket.name,
            tax: ticket.tax,
            gameId: ticket.ticketType.game.id,
            teamAname: ticket.ticketType.game.teamA.name,
            teamAimg: ticket.ticketType.game.teamA.img,
            teamBname: ticket.ticketType.game.teamB.name,
            teamBimg: ticket.ticketType.game.teamB.img,
            championship: ticket.ticketType.game.championship,
            gameDate: ticket.ticketType.game.date,
            gameTime: ticket.ticketType.game.time,
            ticketType: ticket.ticketType.name,
            ticketTypeName: ticket.ticketType.name
          };
          bet.tickets.push(newTicket);
          this._saveBet(bet);
          resolve(bet);
        }
      }, (error) => {
        reject('Aposta não encontrada.');
      });
    });
	}

  removeTicket(ticketId): Promise<any> {
    return new Promise((resolve, reject) => {

      this.getCurrentBet().then((bet) => {
        let index = null;

        bet.tickets.forEach((ticket, i) => {
          if(ticket.id == ticketId) {
            index = i;
          }
        });

        if (index !== null) {
          bet.tickets.splice(index, 1);
          this._saveBet(bet);
          resolve(bet);
        } else {
          reject();
        }
      });
    });
  }

	removeInvalidTickets(tickets): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getCurrentBet().then((bet) => {
        var newTickets = [];
        bet.tickets.forEach((i) => {
          if (tickets.indexOf(i.id) == -1) {
            newTickets.push(i);
          }
        });
        bet.tickets = newTickets;
        this._saveBet(bet);
        resolve(bet);
      });
    });
	}

	getTicketByGameFromBet(bet, game): any {
    var ticket = null;

    if (bet) {
      let length = bet.tickets.length;
      for(var i = 0; i < length; i++) {
        if (bet.tickets[i].gameId == game.id) {
          ticket = bet.tickets[i]; break;
        }
      }
      // bet.tickets.forEach((t) => {
      //   if (t.gameId == game.id) {
      //     ticket = t;
      //   }
      // });
    }

    return ticket;
	}

  /** Private Methods  **/

  private _validateBet(playerName, betAmount) {
		betAmount = parseFloat(betAmount);
		var validation = {valid: false, message: 'Falha ao adicionar aposta'};
		if(!playerName) {
      validation.message = 'Preencha o nome do apostador';

		} else if(isNaN(betAmount)) {
      validation.message = 'Preencha o valor a ser apostado';

    } else if(betAmount < BetService.minBetAmount
      || betAmount > BetService.maxBetAmount) {

      validation.message = 'O valor a ser apostado tem que ser no mínimo ';
      validation.message += BetService.minBetAmount + ' e no máximo ';
      validation.message += + BetService.maxBetAmount + ' reais';

		} else {
			validation.valid = true;
			validation.message = 'Aposta válida';
		}

		return validation;
  }

  private _saveBet(bet) {
    this.storage.set(BetService.betKey, bet);
  }

  private _validateTicketDate(ticket) {
		var game = ticket.ticketType.game;
		let now: any = new Date();
		var d = game.date.split("/");
		var date = d[2]+'-'+d[1]+'-'+d[0];
		let finalDate: any = new Date(date + " " + game.time);
		var diffMs = (finalDate - now); // milliseconds between now & Christmas
		var diffDays = Math.round(diffMs / 86400000); // days
		var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
		var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

		// can't add new ticket when left 5 minutes to the start of the game
		if(diffDays == 0 && diffHrs == 0 && diffMins <= 5) {
			return false;
		} else {
			return true;
		}
	}

	private _validateUniqueTicket(bet, ticket) {
		var validate = true;

		bet.tickets.forEach(function(currentTicket) {
			if(currentTicket.gameId == ticket.ticketType.game.id) {
				validate = false;
			}
		});

		return validate;
	}
}