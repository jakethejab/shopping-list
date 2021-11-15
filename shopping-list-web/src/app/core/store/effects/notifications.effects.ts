import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { displayError, displaySuccess, displayWarning } from '@store/actions/index';

@Injectable()
export class NotificationsEffects {
  constructor(private actions$: Actions, private toastr: ToastrService) { }

  displaySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displaySuccess),
        tap(action => {
          this.toastr.success(action.message, action.title);
        })
      ),
    { dispatch: false }
  );

  displayWarning$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayWarning),
        tap(action => {
          this.toastr.warning(action.message, action.title);
        })
      ),
    { dispatch: false }
  );

  displayError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayError),
        tap(action => {
          this.toastr.error(action.message, action.title);
        })
      ),
    { dispatch: false }
  );
}
