import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetReportDto } from './dtos/get-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportService {

    constructor(
        @InjectRepository(Report) private reportRepo: Repository<Report>
    ) {}

    createEstimate({ make, model, lng, lat, year, mileage }: GetReportDto) {
        return this.reportRepo
          .createQueryBuilder()
          .select('AVG(price)', 'price')
          .where('make = :make', { make })
          .andWhere('model = :model', { model })
          .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
          .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
          .andWhere('year - :year BETWEEN -3 AND 3', { year })
          .andWhere('approved IS TRUE')
          .orderBy('ABS(mileage - :mileage)', 'DESC')
          .setParameters({ mileage })
          .limit(3)
          .getRawOne();
      }


    create(reportDto: CreateReportDto, user: User) {
        const report = this.reportRepo.create(reportDto);
        report.user = user
        return this.reportRepo.save(report);
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.reportRepo.findOne(id);
        if (!report) {
          throw new NotFoundException('report not found');
        }
    
        report.approved = approved;
        return this.reportRepo.save(report);
      }

}
