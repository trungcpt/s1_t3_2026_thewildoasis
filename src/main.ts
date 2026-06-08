import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { applyMiddlewares } from './common/middlewares/common.middleware';
import { LoggerModule } from './logger/logger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerModule.createLogger(),
  });
  applyMiddlewares(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
