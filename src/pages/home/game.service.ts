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
      // let url = API_URL + '/includes/inc.championship.php';
      let url = API_URL + '/includes/inc.get.championship.php';
      url += '?groupId='+userGroupId;

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

  getGames(championship, userGroupId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = API_URL + '/includes/inc.get.games.championship.php';
      url += '?groupId='+userGroupId + '&championshipId=' + championship.id;
      url += '&countryId=' + championship.country.id;

      this.http.get(url).map(res => res.json()).subscribe(response => {
        if(response) {
          resolve(response.championship[0].games);
        } else {
          resolve([]);
        }
      }, (error) => {
        reject('Não foi possível recuperar os jogos.');
      });
    });
  }

  getGame(gameId, sportId, countryId, groupId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = API_URL + '/includes/inc.games.php';
      url += '?gameId=' + gameId + '&sportId=' + sportId;
      url += '&countryId=' + countryId+"groupId="+groupId;

      this.http.get(url).map(res => res.json()).subscribe(response => {
        resolve(response.game[0]);
      }, (error) => {
        reject('Não foi possível recuperar os palpites.');
      });
    });
  }
}