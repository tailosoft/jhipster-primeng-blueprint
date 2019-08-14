import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ITEMS_PER_PAGE } from 'app/shared';
import { lazyLoadEventToQueryParams } from 'app/shared/util/request-util';
import { UserService, AccountService, IUser } from 'app/core';
import { Subscription, merge } from 'rxjs';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { unflatten } from 'flat';
import flatten = require('flat');

@Component({
  selector: 'jhi-user-mgmt',
  templateUrl: './user-management.component.html'
})
export class UserMgmtComponent implements OnInit, OnDestroy, AfterViewInit {
  currentAccount: any;
  users: IUser[];
  eventSubscriber: Subscription;

  totalItems: number;
  itemsPerPage: number;
  loading: boolean;

  @ViewChild('userTable', { static: false })
  userTable: Table;

  constructor(
    protected userService: UserService,
    protected messageService: MessageService,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.loading = true;
  }

  ngOnInit() {
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInUsers();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  ngAfterViewInit() {
    const lazyLoadEvent$ = this.activatedRoute.queryParams.pipe(
      debounceTime(300),
      map(data => <LazyLoadEvent>(<any>unflatten(data)).lle)
    );

    lazyLoadEvent$
      .pipe(
        take(1),
        filter(event => event !== undefined)
      )
      .subscribe(event => {
        Object.assign(this.userTable, event);
        if (event.filters && event.filters.activated) {
          this.userTable.filters.activated.value = event.filters.activated.value === 'true';
        }
      });

    merge(
      lazyLoadEvent$,
      this.eventManager.observable.pipe(
        filter(event => event.name === 'userListModification'),
        map(_ => {})
      )
    )
      .pipe(
        map(event => lazyLoadEventToQueryParams(event || {})),
        tap(() => (this.loading = true)),
        switchMap(params => this.userService.query(params)),
        filter((res: HttpResponse<IUser[]>) => res.ok)
      )
      .subscribe(
        (res: HttpResponse<IUser[]>) => {
          this.paginateUsers(res.body, res.headers);
          this.loading = false;
        },
        (res: HttpErrorResponse) => {
          this.onError(res.message);
          this.loading = false;
        }
      );
  }

  onLazyLoadEvent(event: LazyLoadEvent) {
    const queryParams = flatten({ lle: event });
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && typeof value === 'object' && Object.entries(value).length === 0) {
        delete queryParams[key];
      }
    });
    this.router.navigate(['/admin/user-management'], {
      queryParams
    });
  }

  delete(login: string) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('userManagement.delete.question', { login }),
      accept: () => {
        this.userService.delete(login).subscribe(() => {
          this.eventManager.broadcast({
            name: 'userListModification',
            content: 'Deleted a user'
          });
        });
      }
    });
  }

  trackId(index: number, item: IUser) {
    return item.login;
  }

  registerChangeInUsers() {
    this.eventSubscriber = this.eventManager.subscribe('userListModification', () => {});
  }

  setActive(user, isActivated) {
    user.activated = isActivated;
    this.userService.update(user).subscribe();
  }

  protected paginateUsers(data: IUser[], headers: HttpHeaders) {
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.users = data;
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
