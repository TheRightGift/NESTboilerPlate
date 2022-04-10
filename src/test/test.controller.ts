import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Inject } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { BaseController } from 'src/common/base.controller';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@ApiTags('Test')
@ApiBearerAuth()
@Controller('test')
export class TestController extends BaseController {
	constructor(
		private readonly testService: TestService,
		// Inject the MQ client
		@Inject('TEST_SERVICE') private readonly client: ClientProxy
	) {
		super();
	}

	@Post()
	async create(@Body() createTestDto: CreateTestDto, @Res({ passthrough: true }) res: Response,) {
		const test = await this.testService.create(createTestDto);
		return this.responseSuccess(res, '00', 'Success', test, HttpStatus.OK);
	}

	@Get()
	async findAll( @Res({ passthrough: true }) res: Response,) {
		const test = await this.testService.findAll();
		this.client.emit('allTestFromCDR', test); //MQ client emits some data
		return this.responseSuccess(res, '00', 'Success', test, HttpStatus.OK);
	}

	@Get(':id')
	async findOne(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
		const test = await this.testService.findOne(+id);
		return this.responseSuccess(res, '00', 'Success', test, HttpStatus.OK);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto, @Res({ passthrough: true }) res: Response,) {
		const test = await this.testService.update(+id, updateTestDto);
		return this.responseSuccess(res, '00', 'Success', test, HttpStatus.OK);
	}

	@Delete(':id')
	async remove(@Param('id') id: string, @Res({ passthrough: true }) res: Response,) {
		const test = await this.testService.remove(+id);
		return this.responseSuccess(res, '00', 'Success', test, HttpStatus.OK);
	}

	// Listen for MQ broadcasts
	@EventPattern('allTestFromOtherMicroservices')
	async allTest(data: string){
		console.log(data);		
	}
  
}
