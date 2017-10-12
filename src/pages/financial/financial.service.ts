import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { API_URL } from '../../app/constants';

@Injectable()
export class FinancialService {

  constructor(public http: Http) { }

  getBets(initialDate, finalDate, sellerId, groupId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = API_URL + '/includes/inc.financial.php';
      url += '?dataIni='+initialDate+'&dataFim='+finalDate;
      url += '&seller='+sellerId+'&group='+groupId;

      this.http.get(url).map(res => res.json()).subscribe(response => {
        resolve(response);
      }, (error) => {
        reject('Não foi possível recuperar o financeiro.');
      });
    });
  }
}