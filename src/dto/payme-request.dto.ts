export type PaymeMethodType =
  | 'CheckPerformTransaction'
  | 'PerformTransaction'
  | 'CreateTransaction'
  | 'CancelTransaction'
  | 'CheckTransaction'

export class PaymeRequestDto {
  id: number
  method: PaymeMethodType
  params: any
}
