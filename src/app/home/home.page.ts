import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  encodedData = '';
  QRSCANNED_DATA: string;
  isOn = false;
  scannedData: {};
  scanSub: any;

  constructor(public qrScanCtrl: QRScanner, public toastController: ToastController, public platform: Platform) {
    this.platform.backButton.subscribeWithPriority(0, () => {
      document.getElementsByTagName('body')[0].style.opacity = '1';
      this.scanSub.unsubscribe();
    });
  }

  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  goToQrScan() {
    //this.presentToast("goToQrScan");
    this.qrScanCtrl.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          this.isOn = true;
          this.qrScanCtrl.show();

          this.scanSub = document.getElementsByTagName('body')[0].style.opacity = '0';

          // start scanning
           this.scanSub = this.qrScanCtrl.scan().subscribe((text: string) => {
            document.getElementsByTagName('body')[0].style.opacity = '1';
            console.log('Scanned something', text);
            this.presentToast('Scanned something' + text);
            
            this.isOn = false;

            this.QRSCANNED_DATA = text;

            this.qrScanCtrl.hide();
            this.scanSub.unsubscribe();
            this.openWebpage();
            this.closeScanner();
          }, (err) => {
            this.presentToast(JSON.stringify(err));
          });
          

        } else if (status.denied) {
          console.log('camera permission denied');
          this.presentToast('Camera permission denied');
          this.qrScanCtrl.openSettings();
        } else {
        }
      })
      .catch((e: any) => this.presentToast(e));
  }

  closeScanner() {
    this.isOn = false;
    this.qrScanCtrl.hide();
    this.qrScanCtrl.destroy();
  }

  goToCreateCode() {
    this.presentToast("create codes");
  }

  openWebpage() {
    if(this.isValidURL())
      window.open(this.QRSCANNED_DATA,'_system', 'location=yes');
    else
      this.presentToast("Scanned text is not a valid Url")
  }

  // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
  isValidURL() {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(this.QRSCANNED_DATA);
  }
}
