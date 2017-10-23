import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import {
  AlertController,
  LoadingController,
  ViewController,
  NavParams,
  Events } from 'ionic-angular';

import { Util } from '../../app/util';

@Component({
  selector: 'page-print',
  templateUrl: 'print.html',
})
export class PrintPage {

  bet: any;
  util: any = Util;
  unpairedDevices: any;
  pairedDevices: any;
  loading: boolean = true;

  constructor(
    public bluetoothSerial: BluetoothSerial,
    public params: NavParams,
    public events: Events,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController) {

    this.bet = params.get('bet');
    bluetoothSerial.enable().then(() => {
      this.startScanning();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  startScanning() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.loading = true;

    this.bluetoothSerial.discoverUnpaired().then((success) => {
      this.unpairedDevices = success;
      this.loading = false;
    },(error) => {
      this.loading = false;
      this.alertCtrl.create({
        title: 'Algo falhou :(',
        message: 'Não foi possível listar os dispositivos não-pareados. Por favor, tente novamente',
        buttons: ['OK']
      }).present();
    });

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    }, (error) => {
      this.alertCtrl.create({
        title: 'Algo falhou :(',
        message: 'Não foi possível listar os dispositivos pareados. Por favor, tente novamente',
        buttons: ['OK']
      }).present();
    });
  }

  selectDevice(address: any) {
    this.alertCtrl.create({
      title: 'Conectar ao dispositivo',
      message: 'Você deseja se conectar ao dispositivo para imprimir a aposta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Conectar',
          handler: () => {
            this.printBet(address);
          }
        }
      ]
    }).present();
  }

  printBet(address) {
    let loader = this.loadingCtrl.create({
      content: 'Conectando...'
    });
    loader.present();

		let arr="";
		let cont=0;
		let aposta="";
		let premio="";
		this.bet.tickets.forEach((item, index) => {
      arr = arr+this.util.getRetiraAcentos(item.teamAname)+' x '+this.util.getRetiraAcentos(item.teamBname)+'\n'+item.gameDate+'\nPalpite: '+this.util.getRetiraAcentos(item.name)+'\n'+this.util.getRetiraAcentos(item.ticketType)+' x '+this.util.formattedTaxValue(item.tax)+'\n--------------------------------\n';
      cont++;
		});

		//aposta = number_format(vm.bet.betAmount, 2, ',', '.');
		aposta = this.util.formattedValue(this.bet.betAmount);
		premio = this.util.formattedValue(this.bet.jackpot);
    this.bluetoothSerial.connect(address).subscribe(data => {
      loader.setContent('Imprimindo...');
      this.bluetoothSerial.write(
        this.util.getDateNow()+'                 '+this.util.getTimeNow()+'\n'+
        '  \n'+
        '          * WORLDBETS *         \n'+
        '  \n'+
        '================================\n'+
        'Cliente: '+this.util.getRetiraAcentos(this.bet.playerName)+'\n'+
        'Vendedor: '+this.util.getRetiraAcentos(this.bet.seller)+'\n'+
        'Data/Hora: '+this.bet.date+'\n'+
        'Codigo: '+this.bet.hash+'\n'+
        '================================\n'+
        '            PALPITES            \n'+
        '--------------------------------\n'+
        arr+''+
        '================================\n'+
        'Valor da aposta: R$ '+aposta+'\n'+
        'Palpites: '+cont+'\n'+
        'Premio Possivel: R$ '+premio+'\n'+
        '--------------------------------\n'+
        '* Sera considerado somente o \n'+
        'resultado dos 90 minutos de jogo\n'+
        'e acrescimos.\n'+
        '* Prorrogacao e penaltis sao \n'+
        'ignorados.\n'+
        '* Premio valido somente com a \n'+
        'apresentacao deste bilhete.\n'+
        ' \n \n \n',
      ).then(success => {
        this.alertCtrl.create({
          title: success,
          message: 'Aposta impressa com sucesso!',
          buttons: ['OK']
        }).present();
        loader.dismiss();
      }, failed => {
        this.alertCtrl.create({
          title: failed,
          message: 'Não foi possível imprimir a aposta. Por favor, tente novamente',
          buttons: ['OK']
        }).present();
        loader.dismiss();
      });
    }, error => {
      this.alertCtrl.create({
        title: error,
        message: 'Não foi possível se conectar ao dispositivo. Por favor, tente se conectar ao dispositivo novamente',
        buttons: ['OK']
      }).present();
      loader.dismiss();
    });
  }

  disconnect() {
    this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    }).present();
  }
}