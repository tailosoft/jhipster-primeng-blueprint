import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import {
  computeFilterMatchMode,
  lazyLoadEventToServerQueryParams,
  lazyLoadEventToRouterQueryParams,
  fillTableFromQueryParams
} from 'app/shared/util/request-util';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { UserService } from 'app/core/user/user.service';
import { IUser } from 'app/core/user/user.model';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-user-mgmt',
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit, OnDestroy {
  currentAccount: Account | null = null;
  users: IUser[] | null = null;
  eventSubscriber?: Subscription;

  totalItems?: number;
  itemsPerPage!: number;
  loading!: boolean;

  private filtersDetails: { [_: string]: { matchMode?: string; flatten?: (_: any) => string; unflatten?: (_: string) => any } } = {};

  @ViewChild('userTable', { static: true })
  userTable!: Table;

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

  ngOnInit(): void {
    this.accountService.identity().subscribe((account: Account | null) => {
      this.currentAccount = account;
    });
    this.registerChangeInUsers();
    this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => fillTableFromQueryParams(this.userTable, queryParams, this.filtersDetails)),
        tap(() => (this.loading = true)),
        switchMap(() => this.userService.query(lazyLoadEventToServerQueryParams(this.userTable.createLazyLoadMetadata()))),
        filter((res: HttpResponse<IUser[]>) => res.ok)
      )
      .subscribe(
        (res: HttpResponse<IUser[]>) => {
          this.paginateUsers(res.body!, res.headers);
          this.loading = false;
        },
        (res: HttpErrorResponse) => {
          this.onError(res.message);
          this.loading = false;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  onLazyLoadEvent(event: LazyLoadEvent): void {
    const queryParams = lazyLoadEventToRouterQueryParams(event, this.filtersDetails);
    this.router.navigate(['/admin/user-management'], { queryParams });
  }

  filter(value: any, field: string): void {
    this.userTable.filter(value, field, computeFilterMatchMode(this.filtersDetails[field]));
  }

  delete(login: string): void {
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

  trackId(index: number, item: IUser): string {
    return item.login!;
  }

  registerChangeInUsers(): void {
    this.eventSubscriber = this.eventManager.subscribe('userListModification', () => {});
  }

  setActive(user: IUser, isActivated: boolean): void {
    user.activated = isActivated;
    this.userService.update(user).subscribe();
  }

  protected paginateUsers(data: IUser[], headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.users = data;
  }

  protected onError(errorMessage: string): void {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
