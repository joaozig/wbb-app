import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { API_URL } from '../../app/constants';

@Injectable()
export class LoginService {

  static userKey = 'user';

  constructor(public http: Http, public storage: Storage) { }

  login(user): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = API_URL + '/includes/inc.login.php';
      let headers = new Headers();
      let data = "username="+user.username+"&password="+user.password;

      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http.post(url, data, {headers}).map(res => res.json())
        .subscribe(response => {
          if(response.user) {
            var user = response.user[0];
            this.storage.set(LoginService.userKey, user);
            resolve(user);
          } else {
            reject('Usuário e/ou Senha incorreto(s)');
          }
        }, (error) => {
          reject('Falha ao fazer login');
        });
    });
  }

  getLimit(user): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = API_URL + '/includes/inc.check.limit.php?sellerId='+user.id;

      this.http.get(url).map(res => res.json()).subscribe(response => {
        resolve(response.user[0]);
      }, (error) => {
        reject('Falha ao recuperar o limite');
      });
    });
  }

  getLoggedUser(): Promise<any> {
    return this.storage.get(LoginService.userKey);
  }

  removeUser(): Promise<any> {
    return this.storage.remove(LoginService.userKey);
  }
}