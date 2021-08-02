import { BrowserModule } from '@angular/platform-browser';
import { Inject, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
import { Globals } from '../globals.service';
import { IAppState, CounterActions } from '../store';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgReduxModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/app6/' },
    CounterActions,
    Globals,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  // constructor(private ngRedux: NgRedux<IAppState>, private globals: Globals); // @Inject('localStoreRef') private localStoreRef: any,
  // @Inject('globalEventDispatcherRef') private globalEventDispatcherRef: any
  // {
  //   this.ngRedux.provideStore(localStoreRef);
  //   this.globals.globalEventDistributor = globalEventDispatcherRef;
  // }
}
