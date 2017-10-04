import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user = {username: '', password: ''}

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController) {

  }

  login() {
    let loader = this.loadingCtrl.create({
      content: 'Entrando...'
    });

    loader.present();
  }
}
