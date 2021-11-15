export interface List {
  id: string;
  createdOn?: number;
  name?: string;
  itemsTotal?: number;
  itemsChecked?: number;
  active?: number;
  totalPrice?: { checked: number, unchecked: number },
  isItemsInitializing?: boolean;
  itemsInitialized?: boolean;
}