import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Util } from '../../app/util';

import { ResultsService } from './results.service';

@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: [ResultsService]
})
export class ResultsPage {

  results: any;
  initialDate: any;
  finalDate: any;
  formattedInitialDate: any;
  formattedFinalDate: any;
  pesquisar: any = '';
  shownGroup: any;
  loading: Boolean;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public resultsService: ResultsService) {

    this.currentDate();
  }

  currentDate() {
    var date = new Date();
    this.setDates(date);
  }

  prevDate() {
    console.log(this.pesquisar);
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

    this.loadResults();
  }

  loadResults() {
		var initialDate = Util.formatFilterDate(this.initialDate);
		var finalDate = Util.formatFilterDate(this.finalDate);
    this.resultsService.getResults(initialDate, finalDate)
      .then((response) => {
				this.shownGroup = new Array(response.length);
				for(var i = 0; i < response.length; i++){
					this.shownGroup[i] = true;
				}
        this.results = response;
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
}
