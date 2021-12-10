import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { WRONG_PASSWORD } from './common/errors.constant'
import { PaymeRequestDto } from './dto/payme-request.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(200)
  post(@Body() dto: PaymeRequestDto, @Headers('Authorization') authorization) {
    const { method, params } = dto
    console.log('params', params)

    if (authorization) {
      const token = Buffer.from(
        authorization.split(' ')[1],
        'base64',
      ).toString()
      const password = token.split(':')[1]
      if (password !== process.env.payme_id)
        return { error: { code: -32504, message: WRONG_PASSWORD } }
      switch (method) {
        case 'CreateTransaction':
          return this.appService.createTransaction(params)
        case 'CheckPerformTransaction':
          return this.appService.checkPerformTransaction(params)
        case 'PerformTransaction':
          return this.appService.performTransaction(params)
        case 'CancelTransaction':
          return this.appService.cancelTransaction(params)
        case 'CheckTransaction':
          return this.appService.checkTransaction(params)
        default:
          return null
      }
    } else {
      return { error: { code: -32504, message: WRONG_PASSWORD } }
    }
  }
}
