/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { RegisterServiceRequest } from './sealeon.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { SeaLeonServiceEntity } from './entities/sealeon.service.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { NearService } from './near.service';
import { SeaLeonSecretHashEntity } from './entities/sealeon.secret-hash.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SeaLeonService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(SeaLeonServiceEntity)
    private readonly seaLeonServiceRepo: Repository<SeaLeonServiceEntity>,
    @InjectRepository(SeaLeonSecretHashEntity)
    private readonly seaLeonSecretHashRepo: Repository<SeaLeonSecretHashEntity>,
    private readonly nearService: NearService,
  ) {}

  async registerService(
    providerAddress: string,
    request: RegisterServiceRequest,
    screenshot: Buffer,
    thumbnail: Buffer,
  ) {
    const uuid = randomUUID();

    const newService = this.seaLeonServiceRepo.create({
      ...request,
      uuid,
      providerAddress,
      screenshot,
      thumbnail,
    });

    await this.seaLeonServiceRepo.save(newService);

    return {
      uuid,
    };
  }

  async getService(uuid: string) {
    const value = await this.cacheManager.get(`service-${uuid}`);
    if (value) return value;

    const service = await this.seaLeonServiceRepo.findOne({ where: { uuid } });

    if (!service) throw new Error('Service not found');

    const result = {
      ...service,
      screenshot: `data:image/jpeg;base64,${service.screenshot.toString('base64')}`,
      thumbnail: `data:image/jpeg;base64,${service.thumbnail.toString('base64')}`,
    };

    await this.cacheManager.set(`service-${uuid}`, result, 60000);

    return {
      ...service,
      screenshot: `data:image/jpeg;base64,${service.screenshot.toString('base64')}`,
      thumbnail: `data:image/jpeg;base64,${service.thumbnail.toString('base64')}`,
    };
  }

  async getServices() {
    const value = await this.cacheManager.get('services');
    if (value) return value;

    const servicesOnChain = await this.nearService.getServiceList();

    const result = servicesOnChain.map(async (serviceOnChain) => {
      const serviceOnDb = await this.seaLeonServiceRepo.findOne({
        where: { uuid: serviceOnChain.uuid },
      });

      if (!serviceOnDb) return null;

      return {
        ...serviceOnChain,
        ...serviceOnDb,
        screenshot: `data:image/jpeg;base64,${serviceOnDb.screenshot.toString('base64')}`,
        thumbnail: `data:image/jpeg;base64,${serviceOnDb.thumbnail.toString('base64')}`,
        isUsing: await this.isUsingService(serviceOnChain),
      };
    });

    const info = (await Promise.all(result)).filter((r) => r !== null);

    await this.cacheManager.set('services', info, 1000);

    return info;
  }

  private async isUsingService(serviceOnChain) {
    const value = await this.cacheManager.get(
      `isUsingService-${serviceOnChain.id}`,
    );
    if (value) return value;

    const payLogsOnChain = await this.nearService.getPayLogsByServiceId(
      serviceOnChain.id,
    );

    const usageHistorysOnChain =
      await this.nearService.getUsageHistoryLogList();

    const lastPayLog = payLogsOnChain[payLogsOnChain.length - 1];

    if (!lastPayLog) {
      await this.cacheManager.set(
        `isUsingService-${serviceOnChain.id}`,
        false,
        1000,
      );
      return false;
    }

    const usageHistory = usageHistorysOnChain.find(
      (usageHistory) => usageHistory.pay_log_id === lastPayLog.pay_log_id,
    );

    if (usageHistory) {
      await this.cacheManager.set(
        `isUsingService-${serviceOnChain.id}`,
        true,
        1000,
      );
      return false;
    }

    if (
      this.convertNanoSecondsToMilliSeconds(lastPayLog.dueTimestamp) >=
      Date.now()
    ) {
      await this.cacheManager.set(
        `isUsingService-${serviceOnChain.id}`,
        true,
        1000,
      );
      return true;
    }

    await this.cacheManager.set(
      `isUsingService-${serviceOnChain.id}`,
      false,
      1000,
    );
    return false;
  }

  private convertNanoSecondsToMilliSeconds(nanoSeconds: string) {
    return +nanoSeconds / 1000000;
  }

  private convertNanoSecondsToSeconds(nanoSeconds: string) {
    return Math.round(+nanoSeconds / 1000000000);
  }

  private diffDaysFromNanoSeconds(nanoSeconds: string) {
    const milliseconds = this.convertNanoSecondsToMilliSeconds(nanoSeconds);
    // 현재 날짜 및 시간
    const now = new Date();

    // 타겟 날짜 및 시간 (현재 시간에 milliseconds를 더함)
    const targetDate = new Date(milliseconds);

    // 타겟 날짜와 현재 날짜 사이의 밀리세컨드 차이
    const difference = targetDate.getTime() - now.getTime();

    // 밀리세컨드를 일 단위로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리세컨드)
    const days = difference / (1000 * 60 * 60 * 24);

    return Math.ceil(days); // 남은 일수를 올림하여 반환
  }

  async getConsumerService(consumerAddress: string) {
    const value = await this.cacheManager.get(
      `consumerService-${consumerAddress}`,
    );
    if (value) return value;

    const serviceOnChain =
      await this.nearService.getConsumerService(consumerAddress);

    console.log(serviceOnChain);

    if (!serviceOnChain) throw new Error('Service not found');

    if (!this.isUsingService(serviceOnChain))
      throw new Error('Service not found');

    const serviceOnDb = await this.seaLeonServiceRepo.findOne({
      where: { uuid: serviceOnChain.uuid },
    });

    if (serviceOnChain.uuid !== serviceOnDb.uuid)
      throw new Error('Service not found');

    serviceOnDb.screenshot = null;
    serviceOnDb.thumbnail = null;

    const payLogList = await this.nearService.getPayLogsByServiceId(
      serviceOnChain.id,
    );

    const lastPayLog = payLogList[payLogList.length - 1];

    const result = {
      ...serviceOnChain,
      ...serviceOnDb,
      startUseTimeStamp: lastPayLog.createAt,
      endUseTimeStamp: lastPayLog.dueTimestamp,
    };

    await this.cacheManager.set(
      `consumerService-${consumerAddress}`,
      result,
      1000,
    );

    return result;
  }

  async getProviderServiceList(providerAddress: string) {
    const value = await this.cacheManager.get(
      `providerService-${providerAddress}`,
    );
    if (value) return value;

    const servicesOnDb = await this.seaLeonServiceRepo.find({
      where: { providerAddress },
    });

    const servicesOnChain =
      await this.nearService.getServiceListByProvider(providerAddress);

    const result = servicesOnDb.map(async (serviceOnDb) => {
      const serviceOnChain = servicesOnChain.find(
        (service) => service.uuid === serviceOnDb.uuid,
      );

      if (!serviceOnChain) return null;

      const isUsing = await this.isUsingService(serviceOnChain);

      const payLogsOnChain = await this.nearService.getPayLogsByServiceId(
        serviceOnChain.id,
      );
      const lastPayLog = payLogsOnChain[payLogsOnChain.length - 1];

      const accruedEarning = await this.nearService.getAccruedPayAmount(
        serviceOnChain.id,
      );

      return {
        ...serviceOnDb,
        ...serviceOnChain,
        isUsing,
        lastPayLog,
        accruedEarning,
        screenshot: null,
        thumbnail: null,
      };
    });

    const info = (await Promise.all(result)).filter((r) => r !== null);

    await this.cacheManager.set(
      `providerService-${providerAddress}`,
      info,
      1000,
    );

    return info;
  }

  async getEarning(providerAddress: string) {
    const value = await this.cacheManager.get(`earning-${providerAddress}`);
    if (value) return value;

    const pendingEarn =
      await this.nearService.getPendingEarnByProviderAddress(providerAddress);

    const earned =
      await this.nearService.getEarnedByProviderAddress(providerAddress);

    const info = {
      pendingEarn,
      earned,
    };

    await this.cacheManager.set(`earning-${providerAddress}`, info, 1000);

    return info;
  }

  // header에 담아서
  async getSecretHash(uuid: string, consumerAddress: string) {
    const serviceOnDB = await this.seaLeonServiceRepo.findOne({
      where: { uuid },
    });
    if (!serviceOnDB) throw new Error('Service not found');

    if (serviceOnDB.secretHash) throw new Error('Already issued secret hash');

    const servicesOnChain = await this.nearService.getServiceList();

    const serviceOnChain = servicesOnChain.find(
      (service) => service.uuid === uuid,
    );

    if (!serviceOnChain) throw new Error('Service not found');

    const payLogs = await this.nearService.getPayLogsByServiceId(
      serviceOnChain.id,
    );

    const lastPayLog = payLogs[payLogs.length - 1];

    if (!lastPayLog) throw new Error('No pay log');
    console.log('a', lastPayLog.consumer_address);
    console.log('b', consumerAddress);
    if (lastPayLog.consumer_address !== consumerAddress)
      throw new Error('Invalid consumer');

    const secretHash = randomUUID();

    serviceOnDB.secretHash = secretHash;
    await this.seaLeonServiceRepo.save(serviceOnDB);

    await this.seaLeonSecretHashRepo.insert({
      secretHash,
      endTimeStamp: this.convertNanoSecondsToMilliSeconds(
        lastPayLog.dueTimestamp,
      ).toString(),
    });

    return secretHash;
  }

  async validateSecretHash(secretHash: string) {
    const entity = await this.seaLeonSecretHashRepo.findOne({
      where: { secretHash },
    });

    if (!entity) throw new Error('Invalid secret hash');

    if (+entity.endTimeStamp < Date.now())
      throw new Error('Expired secret hash');

    return true;
  }

  async getProxyPath(hash: string) {
    return 'https://f7b519ecaf7e528f03.gradio.live';
    const service = await this.seaLeonServiceRepo.findOne({
      where: { secretHash: hash },
    });

    if (!service) throw new Error('Service not found');

    await this.validateSecretHash(hash);

    return service.serviceLink;
  }
}
