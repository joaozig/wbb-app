import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { API_URL } from '../../app/constants';

@Injectable()
export class GameService {

  constructor(public http: Http, public storage: Storage) { }

  getChampionships(sportId, userGroupId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = API_URL + '/includes/inc.championship.php';
      url += '?sportId='+sportId+'&groupId='+userGroupId;

      this.http.get(url).map(res => res.json()).subscribe(response => {
        if(response) {
          resolve(response.championship);
        } else {
          resolve([]);
        }
      }, (error) => {
        reject('Não foi possível recuperar os campeonatos.');
      });
    });
  }
}