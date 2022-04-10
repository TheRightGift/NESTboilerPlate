import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvService } from './common/env.service';
import { HttpExceptionFilter } from './common/Exception-Filters/http-exception.filter';
import { ModelExceptionFilter } from './common/Exception-Filters/model-exception.filter';

async function bootstrap() {
  const env = new EnvService().read();

  const app = await NestFactory.createMicroservice(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [`${env.RMQ_URL}`],
        queue: `${env.RMQ_QUEUE}`,
        queueOptions: { durable: false },
      },
  });

  app.listen(() => {
    console.log('Microservice is listening');
    
  })
}
bootstrap();
