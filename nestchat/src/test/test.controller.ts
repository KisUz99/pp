import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('test')
export class TestController {

    @Get()
    controllTest() {
        return {
            message: 'connected',
            statusCode: HttpStatus.OK
        };
    }
}
