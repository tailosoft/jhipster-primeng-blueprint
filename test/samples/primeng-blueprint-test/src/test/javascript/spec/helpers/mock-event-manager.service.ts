import { JhiEventManager } from 'ng-jhipster';
import Spy = jasmine.Spy;

export class MockEventManager extends JhiEventManager {
  broadcastSpy: Spy;

  constructor() {
    super();
    this.broadcastSpy = spyOn(this, 'broadcast').and.callThrough();
  }
}
