import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { BetPage } from '../pages/bet/bet';
import { ResultsPage } from '../pages/results/results';

import { LoginService } from '../pages/login/login.service';

@Component({
  templateUrl: 'app.html',
  providers: [LoginService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;
  user: any = {};
  limit: any = {limit: '-', limit_used: '-'};

  constructor(
    public alertCtrl: AlertController,
    public platform: Platform,
    public events: Events,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public loginService: LoginService) {

    this.initializeApp();

    this.loginService.getLoggedUser().then((user) => {
      if (user) {
        this.user = user;
        this.limit.limit = 'R$ ' + this.user.limit;
        this.limit.limit_used = 'R$ ' + this.user.limit_used;
        this.setRootPage(HomePage);
      } else {
        this.setRootPage(LoginPage);
      }
    });

    events.subscribe('user:logged', (user) => {
      if (user) {
        this.user = user;
        this.limit.limit = 'R$ ' + this.user.limit;
        this.limit.limit_used = 'R$ ' + this.user.limit_used;
      }
    });

    events.subscribe('root:change', (page) => {
      this.setRootPage(page);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.alertCtrl.create({
      title: 'Sair',
      message: 'Você deseja realmente sair?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => { }
        },
        {
          text: 'Sair',
          handler: () => {
            this.loginService.removeUser().then(() => {
              this.nav.setRoot(LoginPage);
            });
          }
        }
      ]
    }).present();
  }

  refreshLimit() {
    this.limit.limit = 'atualizando...';
    this.limit.limit_used = 'atualizando...';

    this.loginService.getLimit(this.user).then((response) => {
      this.limit = response;
      this.limit.limit = 'R$ ' + this.limit.limit;
      this.limit.limit_used = 'R$ ' + this.limit.limit_used;
    });
  }

  showPage(page) {
    switch(page) {
      case 'home':
        this.setRootPage(HomePage); break;
      case 'bet':
        this.setRootPage(BetPage); break;
      case 'results':
        this.setRootPage(ResultsPage); break;
    }
  }

  setRootPage(page) {
    this.rootPage = page;
  }
}
