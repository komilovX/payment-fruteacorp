import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  AMOUNT_IS_NOT_VALID,
  ORDER_NOT_ACTIVE,
  ORDER_NOT_FOUND,
} from './common/errors.constant'
import { Orders } from './entities/order.entity'
import { Transaction } from './entities/transaction.entity'
import { Users } from './entities/user.entity'
import {
  calculateTotal,
  returnCancelTransaction,
  returnError,
  returnPerformTransaction,
  returnResultTransaction,
  sendMessageToBot,
} from './helpers/methods'

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async checkPerformTransaction(params: any) {
    // check to exist object
    const order = await this.ordersRepository.findOne({
      id: params.account['FruteaCorp'],
    })

    if (!order) return { error: { code: -31050, message: ORDER_NOT_FOUND } }

    const amaount = calculateTotal(order.products, order.delivery)

    if (params.amount !== amaount)
      return { error: { code: -31001, message: AMOUNT_IS_NOT_VALID } }

    if (order.status === 'new' && !order.isPaid) {
      return {
        result: {
          allow: true,
        },
      }
    }
    return { error: { code: -31050, message: ORDER_NOT_ACTIVE } }
  }

  async createTransaction(params: any) {
    const transaction = await this.findTransaction(params.id)
    if (transaction) {
      if (transaction.state === 1) {
        const time = params.time - new Date(transaction.createdDate).getTime()
        if (time < 43200000) return returnResultTransaction(1, transaction)

        await this.transactionRepository.update(transaction, {
          state: -1,
        })
        return returnError(params.id, -31008)
      }
      return returnError(params.id, -31008)
    }
    const order = await this.ordersRepository.findOne({
      id: params.account['FruteaCorp'],
    })

    if (!order) return { error: { code: -31050, message: ORDER_NOT_FOUND } }

    const amaount = calculateTotal(order.products, order.delivery)
    if (params.amount !== amaount)
      return { error: { code: -31001, message: AMOUNT_IS_NOT_VALID } }

    if (order.status !== 'new')
      return { error: { code: -31050, message: ORDER_NOT_ACTIVE } }

    await this.ordersRepository.update(order, {
      status: 'pending',
      transactionId: params.id,
    })
    let newTransaction = this.transactionRepository.create({
      type: 'payme',
      transactionId: params.id,
      amount: params.amount,
      chat_id: order.chat_id,
      state: 1,
    })
    newTransaction = await this.transactionRepository.save(newTransaction)

    return returnResultTransaction(1, newTransaction)
  }

  async cancelTransaction(params: any) {
    const transaction = await this.findTransaction(params.id)
    if (!transaction) return returnError(params.id, -31003)

    if (transaction.state === 2 || transaction.state === 1) {
      // check order status to cancel

      let updatedTransaction = await this.transactionRepository.preload({
        id: transaction.id,
        state: transaction.state === 2 ? -2 : -1,
        cancel_time: new Date().getTime().toString(),
        reason: params.reason,
      })
      updatedTransaction = await this.transactionRepository.save(
        updatedTransaction,
      )
      return returnCancelTransaction(
        updatedTransaction.state,
        updatedTransaction,
      )
    }
    return returnCancelTransaction(transaction.state, transaction)
  }

  async performTransaction(params: any) {
    const transaction = await this.findTransaction(params.id)

    if (!transaction) return returnError(params.id, -31003)
    if (transaction.state === 1) {
      const time =
        new Date().getTime() - new Date(transaction.createdDate).getTime()
      if (time < 43200000) {
        // close transaction
        let updatedTransaction = await this.transactionRepository.preload({
          id: transaction.id,
          state: 2,
          perform_time: new Date().getTime().toString(),
        })
        updatedTransaction = await this.transactionRepository.save(
          updatedTransaction,
        )
        const order = await this.ordersRepository.findOne({
          transactionId: transaction.transactionId,
        })
        await this.ordersRepository.update(order, {
          status: 'active',
          isPaid: true,
        })
        const user = await this.userRepository.findOne({
          chat_id: transaction.chat_id,
        })
        sendMessageToBot(transaction.chat_id, user.lang)
        return returnPerformTransaction(2, updatedTransaction)
      }
      // cancel transaction
      await this.transactionRepository.update(transaction, {
        state: -1,
      })
      return returnError(params.id, -31008)
    }

    if (transaction.state === 2) return returnPerformTransaction(2, transaction)

    return returnError(params.id, -31008)
  }

  async checkTransaction(params: any) {
    const transaction = await this.findTransaction(params.id)
    if (!transaction) return returnError(params.id, -31003)
    const { createdDate, perform_time, cancel_time, state, reason } =
      transaction
    return {
      result: {
        create_time: new Date(createdDate).getTime(),
        perform_time: perform_time ? +perform_time : 0,
        cancel_time: cancel_time ? +cancel_time : 0,
        transaction: transaction.id.toString(),
        state,
        reason,
      },
    }
  }

  private findTransaction(id: string) {
    return this.transactionRepository.findOne({
      transactionId: id,
    })
  }
}
