import { NotificationsEffects } from '@store/effects/notifications.effects';
import { ListsEffects } from '@store/effects/lists.effects';
import { ItemsEffects } from '@store/effects/items.effects';

export const effects: any[] = [
  NotificationsEffects,
  ListsEffects,
  ItemsEffects
];

export * from '@store/effects/notifications.effects';
export * from '@store/effects/lists.effects';
export * from '@store/effects/items.effects';