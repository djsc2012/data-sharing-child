import { AfterViewInit, Component, HostListener } from '@angular/core';

const IFRAME_LOADED = 'IFRAME_LOADED';
const STORE_LOADED = 'STORE_LOADED';
const STORE_REFRESH = 'STORE_REFRESH';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'test-project-iframe';
  countries: any;
  loading: boolean = true;

  @HostListener('window:message', ['$event'])
  onMessage(event: { data: { type: string; data: any } }) {
    // console.log('Message received in child', event);
    const { type, data } = event.data;
    if (type === STORE_LOADED) {
      console.log('CHILD | Store Received', data);
      console.log('window', (<any>window.top)['getGlobalStore']());
      this.saveStore(data);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('CHILD | IFrame view and logic loaded');
      this.postMessage({
        type: IFRAME_LOADED,
      });
    }, 1000);
  }

  postMessage(event: { type: string; data?: any }) {
    window.top?.postMessage(event, '*');
  }

  saveStore(store: any) {
    this.loading = false;
    this.countries = store;
  }

  requestRefresh() {
    console.log('CHILD | Requesting store fresh to parent');
    this.postMessage({
      type: STORE_REFRESH,
    });
  }
}
