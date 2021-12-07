export type PaymentType = 'payme' | 'click'
export type OrderType = 'cash' | 'payme' | 'click'
export type OrderStatus =
  | 'new'
  | 'pending'
  | 'active'
  | 'cancelled'
  | 'delivered'
