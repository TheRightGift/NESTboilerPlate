import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [
    TypeOrmModule.forFeature([Test]),
	ClientsModule.register([
		{ 
			name: 'TEST_SERVICE', 
			transport: Transport.RMQ,
			options: {
				urls: ['urlGoesHere'],
				queue: 'queueGoesHere',
				queueOptions: {
					durable: false
				}
			}
		},
			
	]),
]
})
export class TestModule {}
