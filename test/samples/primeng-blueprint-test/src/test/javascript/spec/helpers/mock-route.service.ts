import Spy = jasmine.Spy;
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { SpyObject } from './spyobject';

export class MockActivatedRoute extends ActivatedRoute {
  constructor(parameters?: any) {
    super();
    this.queryParams = new BehaviorSubject(parameters);
    this.params = new BehaviorSubject(parameters);
    this.data = new BehaviorSubject(parameters);
  }
}

export class MockRouter extends SpyObject {
  navigateSpy: Spy;
  navigateByUrlSpy: Spy;
  events: Observable<RouterEvent> | null = null;
  routerState: any;
  url = '';

  constructor() {
    super(Router);
    this.navigateSpy = this.spy('navigate');
    this.navigateByUrlSpy = this.spy('navigateByUrl');
  }

  setEvents(events: Observable<RouterEvent>): void {
    this.events = events;
  }

  setRouterState(routerState: any): void {
    this.routerState = routerState;
  }
}
