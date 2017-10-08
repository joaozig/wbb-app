import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController,
    public resultsService: ResultsService) {

    this.currentDate();
  }

  currentDate() {
    var date = new Date();
    this.setDates(date);
  }

  setDates(date) {
    this.initialDate = Util.getMonday(date);
    this.finalDate = Util.getSunday(date);
    this.loadResults();
  }

  loadResults() {
    console.log(this.initialDate)
    console.log(this.finalDate)
  }
}
