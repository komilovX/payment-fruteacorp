import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { PaymeRequestDto } from './dto/payme-request.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(200)
  post(@Body() dto: PaymeRequestDto) {
    const { method, params } = dto

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
  }
}
