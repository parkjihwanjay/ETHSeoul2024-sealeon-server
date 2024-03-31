import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SeaLeonService } from './sealeon.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

// provider가 업로드 할때 백엔드
//     serviceLink: "" - string,
//     serviceName: "" - string ,
//     serviceDescription: "" - string,
//     tags: [] -string[],
//     serviceImages: [] - image[],
//     serviceSubtitle: "" - string,
//     serviceLongDescription: "" string(long),

// header - login 되어 있는 지갑 주소

export interface RegisterServiceRequest {
  serviceLink: string;
  resourceLink: string;
  serviceName: string;
  serviceDescription: string;
  tags: string[];
  serviceSubtitle: string;
  serviceLongDescription: string;
}

@Controller()
export class SeaLeonController {
  constructor(private readonly seaLeonService: SeaLeonService) {}

  @Get('/health')
  health() {
    return Date.now();
  }

  @Post('/register-service')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'serviceImage', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      {
        limits: { fileSize: 10 * 1024 * 1024 },
      },
    ),
  )
  registerService(
    @Headers('signedAccountId') providerAddress: string,
    @UploadedFiles()
    files: {
      serviceImage?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
    @Body() registerServiceRequest: RegisterServiceRequest,
  ) {
    return this.seaLeonService.registerService(
      providerAddress,
      registerServiceRequest,
      files.serviceImage[0].buffer,
      files.thumbnail[0].buffer,
    );
  }

  @Get('/services')
  getServiceList() {
    return this.seaLeonService.getServices();
  }

  @Get('/services/consumer')
  getConsumerService(@Headers('signedAccountId') consumerAddress: string) {
    return this.seaLeonService.getConsumerService(consumerAddress);
  }

  @Get('/services/provider')
  getProviderServiceList(@Headers('signedAccountId') providerAddress: string) {
    return this.seaLeonService.getProviderServiceList(providerAddress);
  }

  @Get('/hash/:uuid')
  getSecretHash(
    @Headers('signedAccountId') consumerAddress: string,
    @Param('uuid') uuid: string,
  ) {
    return this.seaLeonService.getSecretHash(uuid, consumerAddress);
  }

  @Get('/provider/earning')
  getEarning(@Headers('signedAccountId') providerAddress: string) {
    return this.seaLeonService.getEarning(providerAddress);
  }
}
