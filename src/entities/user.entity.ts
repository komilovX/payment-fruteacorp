import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  chat_id: number

  @Column()
  lang: 'uz' | 'ru'
}
