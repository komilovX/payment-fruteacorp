import { PaymentType } from 'src/common/types'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  transactionId: string

  @Column('int')
  amount: number

  @Column()
  type: PaymentType

  @Column()
  state: number

  @Column({ nullable: true })
  reason: number

  @Column({ nullable: true })
  chat_id: number

  @CreateDateColumn({ name: 'createdDate', readonly: true })
  createdDate: Date

  @Column({ type: 'varchar', length: 20, nullable: true })
  perform_time: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  cancel_time: string
}
