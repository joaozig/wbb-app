import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { API_URL } from '../../app/constants';

@Injectable()
export class LoginService {

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
            this.storage.set('user', user);
            resolve(user);
          } else {
            reject('Usuário e/ou Senha incorreto(s)');
          }
        }, (error) => {
          reject('Falha ao fazer login');
        });
    });
  }
}