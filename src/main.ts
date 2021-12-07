import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  console.log(process.env.APP_PORT)

  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT || 5000)
}
bootstrap()
