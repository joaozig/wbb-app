import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { Util } from '../../app/util';

import { FinishedBetPage } from '../finished-bet/finished-bet';

import { FinancialService } from './financial.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'page-financial',
  templateUrl: 'financial.html',
  providers: [FinancialService, LoginService]
})
export class FinancialPage {

  util: any = Util;
  sellers: any;
  resume: any;
  initialDate: any;
  finalDate: any;
  formattedInitialDate: any;
  formattedFinalDate: any;
  shownGroup: any = [true, true, true];
  sellerId: any;
  groupId: any;
  loading: Boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public events: Events,
    public financialService: FinancialService,
    public loginService: LoginService) {

    let groupId = navParams.get('group');
    let initialDate = navParams.get('initialDate');

    if (groupId) {
      this.sellerId = 0
      this.groupId = groupId;
      this.currentDate(initialDate);
    } else {
      this.loginService.getLoggedUser().then((user) => {
        this.sellerId = user.id;
        this.groupId = 0;
        this.currentDate(initialDate);
      });
    }

    events.subscribe('bet:cancelled', () => {
      this.loadData();
    });
  }

  currentDate(initialDate=null) {
    let date: any = new Date();

    if(initialDate) {
      date = initialDate;
    }

    this.setDates(date);
  }

  betResume(bet) {
    this.navCtrl.push(FinishedBetPage, {hash: bet.hash});
  }

  prevDate() {
  	this.setDates(this.initialDate.setDate(this.initialDate.getDate() - 2));
  }

  nextDate() {
		this.setDates(this.finalDate.setDate(this.finalDate.getDate() + 2));
  }

  setDates(date) {
    this.initialDate = Util.getMonday(date);
    this.finalDate = Util.getSunday(date);

    this.formattedInitialDate = Util.formatDate(this.initialDate);
    this.formattedFinalDate = Util.formatDate(this.finalDate);

    this.loadData();
  }

  loadData() {
    this.loading = true;
		var initialDate = Util.formatFilterDate(this.initialDate);
		var finalDate = Util.formatFilterDate(this.finalDate);
    this.financialService.getBets(initialDate, finalDate, this.sellerId, this.groupId)
      .then((response) => {
        this.sellers = response.dados;
        this.resume = response.resume;
        this.loading = false;

      }, (errorMessage) => {
        this.alertCtrl.create({
          title: 'Algo falhou :(',
          message: errorMessage,
          buttons: ['OK']
        }).present();
      });
  }

	toggleGroup(index) {
    this.shownGroup[index] = !this.shownGroup[index];
  };

  typeClass(typeIndex) {
  	if(typeIndex == 0) {
  		return 'item-dark';
  	} else if(typeIndex == 1) {
  		return 'item-positive';
  	} else if(typeIndex == 2) {
  		return 'item-assertive';
  	}
  }

  getColorBetStatus(status) {
		if(status.toLowerCase() == 'perdeu'){
			return 'red';
		} else if(status.toLowerCase() == 'pendente') {
			return 'green';
		} else {
			return 'green';
		}
	}

	getColorNetValue(value) {
		if(parseFloat(value) < 0){
			return '#FF4C4C';
		} else {
			return '#6AB56A';
		}
	}
}
