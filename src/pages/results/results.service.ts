import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { API_URL } from '../../app/constants';

@Injectable()
export class ResultsService {

  constructor(public http: Http) { }

  getResults(initialDate, finalDate): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = API_URL + '/includes/inc.result.php?dataIni='+initialDate+'&dataFim='+finalDate;;

      this.http.get(url).map(res => res.json()).subscribe(response => {
        resolve(response);
      }, (error) => {
        reject('Não foi possível recuperar os resultados.');
      });
    });
  }
}