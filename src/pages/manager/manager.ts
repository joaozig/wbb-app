import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { Util } from '../../app/util';

import { FinancialPage } from '../financial/financial';
import { FinancialService } from '../financial/financial.service';

@Component({
  selector: 'page-manager',
  templateUrl: 'manager.html',
  providers: [FinancialService]
})
export class ManagerPage {

  util: any = Util;
  general: any;
  showGeneral: any;
  groups: any;
  shownGroup: any;
  resume: any;
  comissions: any;
  prizes: any;
  netValues: any;

  initialDate: any;
  finalDate: any;
  formattedInitialDate: any;
  formattedFinalDate: any;
  loading: Boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public financialService: FinancialService) {

    let date: any = navParams.get('initialDate');
		if(!date || date == 'initial') {
			date = new Date();
    }
    this.setDates(date);
  }

  currentDate() {
    var date = new Date();
    this.setDates(date);
  }

  prevDate() {
  	this.setDates(this.initialDate.setDate(this.initialDate.getDate() - 2));
  }

  nextDate() {
		this.setDates(this.finalDate.setDate(this.finalDate.getDate() + 2));
  }

  setDates(date) {
    this.loading = true;
    this.initialDate = Util.getMonday(date);
    this.finalDate = Util.getSunday(date);

    this.formattedInitialDate = Util.formatDate(this.initialDate);
    this.formattedFinalDate = Util.formatDate(this.finalDate);

    this.loadData();
  }

  loadData() {
		var initialDate = Util.formatFilterDate(this.initialDate);
		var finalDate = Util.formatFilterDate(this.finalDate);
    this.financialService.getResume(initialDate, finalDate)
      .then((response) => {
				this.general = response.shift();
				this.groups = response;

				if(this.general.admin) {
					this.showGeneral = true;
				} else {
					this.showGeneral = false;
					this.toggleGroup(this.groups[0]);
				}
        this.loading = false;

      }, (errorMessage) => {
        this.alertCtrl.create({
          title: 'Algo falhou :(',
          message: errorMessage,
          buttons: ['OK']
        }).present();
      });
  }

  sellerBets(group) {
    this.navCtrl.push(FinancialPage, {
      group: group.id,
      seller: 0,
      initialDate: this.initialDate
    });
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
}
