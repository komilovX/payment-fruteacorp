import { OrderStatus, OrderType } from 'src/common/types'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  date: Date

  @Column({ type: 'varchar', length: 50 })
  orderType: OrderType

  @Column({ type: 'varchar', length: 50 })
  status: OrderStatus

  @Column()
  total: number

  @Column({ nullable: true })
  transactionId: string

  @Column()
  chat_id: number

  @Column()
  isPaid: boolean
}
