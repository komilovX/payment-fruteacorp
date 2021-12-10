import { Transaction } from 'src/entities/transaction.entity'
import axios from 'axios'

const orderText = {
  uz: 'Sizning buyurtmangiz qabul qilindi',
  ru: 'Ваш заказ принят',
}
export function returnError(id: number, code: number) {
  return {
    error: {
      code,
      message: {
        ru: 'Номер телефона не найден',
        uz: "Raqam ro'yhatda yo'q",
        en: 'Phone number not found',
      },
    },
    id,
  }
}

export function returnResultTransaction(state, transaction: Transaction) {
  return {
    result: {
      state,
      transaction: transaction.id.toString(),
      create_time: new Date(transaction.createdDate).getTime(),
    },
  }
}

export function returnCancelTransaction(state, transaction: Transaction) {
  return {
    result: {
      state,
      transaction: transaction.id.toString(),
      cancel_time: +transaction.cancel_time,
    },
  }
}

export function returnPerformTransaction(state, transaction: Transaction) {
  return {
    result: {
      state,
      transaction: transaction.id.toString(),
      perform_time: +transaction.perform_time,
    },
  }
}

export function sendMessageToBot(chat_id, lang = 'uz') {
  axios.post(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${orderText[lang]}&parse_mode=html`,
  )
}

export function calculateTotal(products, delivery) {
  return (
    JSON.parse(products).reduce(
      (acc, val) => acc + Number(val.amount * val.price),
      0,
    ) + delivery
  )
}
