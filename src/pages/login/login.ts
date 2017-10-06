import { Component } from '@angular/core';
import {
  NavController,
  LoadingController,
  AlertController,
  MenuController,
  Events
} from 'ionic-angular';

import { HomePage } from '../home/home';
import { LoginService } from './login.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [LoginService]
})
export class LoginPage {

  user = {username: '', password: ''}

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public events: Events,
    public loginService: LoginService) {

      menuCtrl.enable(false);
  }

  login() {
    let loader = this.loadingCtrl.create({
      content: 'Entrando...'
    });
    loader.present();

    this.loginService.login(this.user).then(user => {
      loader.dismiss();
      this.events.publish('user:logged', user);
      this.menuCtrl.enable(true);
      this.navCtrl.setRoot(HomePage);
    }, error => {
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Login falhou :(',
        subTitle: error,
        buttons: ['OK']
      }).present();
    });
  }
}
