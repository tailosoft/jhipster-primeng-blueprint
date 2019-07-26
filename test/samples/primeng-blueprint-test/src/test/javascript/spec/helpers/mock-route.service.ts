import { ActivatedRoute, Router } from '@angular/router';
import { SpyObject } from './spyobject';
import { Observable, BehaviorSubject, of } from 'rxjs';
import Spy = jasmine.Spy;

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
  events: Observable<any>;

  constructor() {
    super(Router);
    this.navigateSpy = this.spy('navigate');
    this.navigateByUrlSpy = this.spy('navigateByUrl');
  }

  setRouterEvent(event: any) {
    this.events = of(event);
  }
}
