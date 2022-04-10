import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository, QueryRunner, Connection } from 'typeorm';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';
import testData from './test.json';

@Injectable()
export class TestService extends AbstractService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepo: Repository<Test>,
    private readonly conn: Connection
  ) {
    super(testRepo);
  }

	async onApplicationBootstrap() {
		console.log(`Configuring predefined test data...`); 
		const testRepo = await this.conn.getRepository(Test);
		const tests = await testRepo.find();
		let msg = '';
		let testLen = tests.length;

		if(testLen < 1){//check if
			console.log(`Inserting test predefined data`); 
			await testRepo.insert(testData);
			msg = `${testData.length} rows of data inserted`;
		} else {
			msg = 'Test predefined data exists in DB';
		}
		
		console.log(`${msg}`);
	}
}
