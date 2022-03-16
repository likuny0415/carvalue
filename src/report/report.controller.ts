import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from '../guards/auth.guard'
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetReportDto } from './dtos/get-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { 
  }

  @Post("create")
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
   createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
     return this.reportService.create(body, user);
   }

  
   @Post('/:id')
   @UseGuards(AdminGuard)
   approveReport(@Param("id") id: string, @Body() body: ApproveReportDto) {
    return this.reportService.changeApproval(id, body.approved);
   }

   @Get()
   getEstimate(@Query() query: GetReportDto) {
    return this.reportService.createEstimate(query);
  }

}
