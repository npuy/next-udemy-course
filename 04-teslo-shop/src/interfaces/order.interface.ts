export interface Order {
  id: string;
  itemsInOrder: number;
  subTotal: number;
  tax: number;
  total: number;
  isPaid: boolean;
  paidAt: Date | null;
}
