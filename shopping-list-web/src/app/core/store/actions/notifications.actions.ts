import { createAction, props } from '@ngrx/store';
import { Notification } from '@core/models';

export const addNotification = createAction(
  '[Notfication] Add Notification',
  props<{ notification: Notification }>()
);

export const removeNotification = createAction(
  '[Notfication] Remove Notification',
  props<{ notificationId: string }>()
);

export const removeAllNotifications = createAction(
  '[Notfication] Remove All Notifications'
);

export const displaySuccess = createAction(
  '[Notification] Display Success',
  props<{ title?: string; message: string }>()
);

export const displayWarning = createAction(
  '[Notification] Display Warning',
  props<{ title?: string; message: string }>()
);

export const displayError = createAction(
  '[Notification] Display Error',
  props<{ title?: string; message: string }>()
);
