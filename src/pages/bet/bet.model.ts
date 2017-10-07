import { Util } from '../../app/util';

export class Bet {

	id;
	playerName;
	seller;
	betAmount;
	tickets;
	date;
	maxJackpot = 15000;

  constructor(options) {
		this.id = (options && options.id) ? options.id : null;
		this.playerName = (options && options.playerName) ? options.playerName : '';
		this.seller = (options && options.seller) ? options.seller : null;
		this.betAmount = (options && options.betAmount) ? options.betAmount : 0;
		this.tickets = (options && options.tickets) ? options.tickets : [];
		this.date = (options && options.date) ? options.date : null;
  }

	getBetAmount() {
		return Util.formattedValue(this.betAmount);
	}

	getJackpot() {
		return Util.formattedValue(this.jackpot());
	}

	jackpot() {
		var amount = 0;

		this.tickets.forEach(function(ticket) {
			if (amount == 0) {
				amount = this.betAmount;
			}

			amount = (ticket.tax * amount);
		});

		if(amount > this.maxJackpot) {
			amount = this.maxJackpot;
		}

		return amount;
	}
}