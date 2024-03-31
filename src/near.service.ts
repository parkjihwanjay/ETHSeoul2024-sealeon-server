import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import * as nearAPI from 'near-api-js';
import { Cache } from 'cache-manager';

@Injectable()
export class NearService {
  private readonly config = {
    networkId: 'testnet', // 메인넷의 경우 'mainnet'
    nodeUrl: 'https://rpc.testnet.near.org',
    contractName: 'test09.sealeon.testnet', // 조회할 스마트 컨트랙트 이름
  };
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getServiceList(): Promise<any> {
    const value = await this.cacheManager.get('serviceList');

    if (value) return value;
    // NEAR 연결 초기화
    const { connect, keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect(
      Object.assign({ deps: { keyStore } }, this.config),
    );
    // 계정 및 컨트랙트 초기화
    const account = await near.account(this.config.contractName);
    const contract = new nearAPI.Contract(
      account, // 계정 객체
      this.config.contractName, // 스마트 컨트랙트 이름
      {
        viewMethods: ['get_service_list'], // 읽기 전용 메소드 이름
        changeMethods: [], // 쓰기 가능 메소드 이름 (이 예시에서는 사용하지 않음)
        useLocalViewExecution: false, // 로컬 실행 여부
      },
    );
    // 스마트 컨트랙트의 'getInfo' 메소드 호출
    const info = await contract.get_service_list();

    await this.cacheManager.set('serviceList', info, 1000);
    return info;
  }

  async getServiceListByProvider(providerAddress: string): Promise<any> {
    const value = await this.cacheManager.get('serviceListByProvider');

    if (value) return value;
    // NEAR 연결 초기화
    const { connect, keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect(
      Object.assign({ deps: { keyStore } }, this.config),
    );
    // 계정 및 컨트랙트 초기화
    const account = await near.account(this.config.contractName);
    const contract = new nearAPI.Contract(
      account, // 계정 객체
      this.config.contractName, // 스마트 컨트랙트 이름
      {
        viewMethods: ['get_service_list_by_provider'], // 읽기 전용 메소드 이름
        changeMethods: [], // 쓰기 가능 메소드 이름 (이 예시에서는 사용하지 않음)
        useLocalViewExecution: false, // 로컬 실행 여부
      },
    );
    // 스마트 컨트랙트의 'getInfo' 메소드 호출
    const info = await contract.get_service_list_by_provider({
      provider_address: providerAddress,
    });

    await this.cacheManager.set('serviceListByProvider', info, 1000);
    return info;
  }

  async getConsumerService(consumerAddress: string): Promise<any> {
    const value = await this.cacheManager.get(
      `consumerService-${consumerAddress}`,
    );
    if (value) return value;
    // NEAR 연결 초기화
    const { connect, keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect(
      Object.assign({ deps: { keyStore } }, this.config),
    );
    // 계정 및 컨트랙트 초기화
    const account = await near.account(this.config.contractName);
    const contract = new nearAPI.Contract(
      account, // 계정 객체
      this.config.contractName, // 스마트 컨트랙트 이름
      {
        viewMethods: ['get_service_by_consumer'], // 읽기 전용 메소드 이름
        changeMethods: [], // 쓰기 가능 메소드 이름 (이 예시에서는 사용하지 않음)
        useLocalViewExecution: false, // 로컬 실행 여부
      },
    );
    // 스마트 컨트랙트의 'getInfo' 메소드 호출
    const info = await contract.get_service_by_consumer({
      consumer_address: consumerAddress,
    });

    await this.cacheManager.set(
      `consumerService-${consumerAddress}`,
      info,
      1000,
    );
    return info;
  }

  async getPayLogsByServiceId(serviceId: string): Promise<any> {
    const value = await this.cacheManager.get(`payLogs-${serviceId}`);
    if (value) return value;
    // NEAR 연결 초기화
    const { connect, keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect(
      Object.assign({ deps: { keyStore } }, this.config),
    );
    // 계정 및 컨트랙트 초기화
    const account = await near.account(this.config.contractName);
    const contract = new nearAPI.Contract(
      account, // 계정 객체
      this.config.contractName, // 스마트 컨트랙트 이름
      {
        viewMethods: ['get_pay_logs_by_service_id'], // 읽기 전용 메소드 이름
        changeMethods: [], // 쓰기 가능 메소드 이름 (이 예시에서는 사용하지 않음)
        useLocalViewExecution: false, // 로컬 실행 여부
      },
    );
    // 스마트 컨트랙트의 'getInfo' 메소드 호출
    const info = await contract.get_pay_logs_by_service_id({
      service_id: serviceId,
    });

    await this.cacheManager.set(`payLogs-${serviceId}`, info, 1000);
    return info;
  }

  async getPendingEarnByProviderAddress(providerAddress: string): Promise<any> {
    const value = await this.cacheManager.get(`pendingEarn-${providerAddress}`);
    if (value) return value;
    // NEAR 연결 초기화
    const { connect, keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect(
      Object.assign({ deps: { keyStore } }, this.config),
    );
    // 계정 및 컨트랙트 초기화
    const account = await near.account(this.config.contractName);
    const contract = new nearAPI.Contract(
      account, // 계정 객체
      this.config.contractName, // 스마트 컨트랙트 이름
      {
        viewMethods: ['get_ledger_by_provider_address'], // 읽기 전용 메소드 이름
        changeMethods: [], // 쓰기 가능 메소드 이름 (이 예시에서는 사용하지 않음)
        useLocalViewExecution: false, // 로컬 실행 여부
      },
    );
    // 스마트 컨트랙트의 'getInfo' 메소드 호출
    const info = await contract.get_ledger_by_provider_address({
      provider_address: providerAddress,
    });

    await this.cacheManager.set(`pendingEarn-${providerAddress}`, info, 1000);
    return info;
  }

  async getEarnedByProviderAddress(providerAddress: string): Promise<any> {
    const value = await this.cacheManager.get(`earned-${providerAddress}`);
    if (value) return value;
    // NEAR 연결 초기화
    const { connect, keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect(
      Object.assign({ deps: { keyStore } }, this.config),
    );
    // 계정 및 컨트랙트 초기화
    const account = await near.account(this.config.contractName);
    const contract = new nearAPI.Contract(
      account, // 계정 객체
      this.config.contractName, // 스마트 컨트랙트 이름
      {
        viewMethods: ['get_earned_by_provider_address'], // 읽기 전용 메소드 이름
        changeMethods: [], // 쓰기 가능 메소드 이름 (이 예시에서는 사용하지 않음)
        useLocalViewExecution: false, // 로컬 실행 여부
      },
    );
    // 스마트 컨트랙트의 'getInfo' 메소드 호출
    const info = await contract.get_earned_by_provider_address({
      provider_address: providerAddress,
    });

    await this.cacheManager.set(`earned-${providerAddress}`, info, 1000);
    return info;
  }

  async getUsageHistoryLogList(): Promise<any> {
    const value = await this.cacheManager.get('usageHistoryLogList');
    if (value) return value;
    // NEAR 연결 초기화
    const { connect, keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect(
      Object.assign({ deps: { keyStore } }, this.config),
    );
    // 계정 및 컨트랙트 초기화
    const account = await near.account(this.config.contractName);
    const contract = new nearAPI.Contract(
      account, // 계정 객체
      this.config.contractName, // 스마트 컨트랙트 이름
      {
        viewMethods: ['get_usage_history_logs'], // 읽기 전용 메소드 이름
        changeMethods: [], // 쓰기 가능 메소드 이름 (이 예시에서는 사용하지 않음)
        useLocalViewExecution: false, // 로컬 실행 여부
      },
    );
    // 스마트 컨트랙트의 'getInfo' 메소드 호출
    const info = await contract.get_usage_history_logs();

    await this.cacheManager.set('usageHistoryLogList', info, 1000);
    return info;
  }

  async getAccruedPayAmount(serviceId: string): Promise<any> {
    const value = await this.cacheManager.get(`accruedPayAmount-${serviceId}`);
    if (value) return value;
    // NEAR 연결 초기화
    const { connect, keyStores } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect(
      Object.assign({ deps: { keyStore } }, this.config),
    );
    // 계정 및 컨트랙트 초기화
    const account = await near.account(this.config.contractName);
    const contract = new nearAPI.Contract(
      account, // 계정 객체
      this.config.contractName, // 스마트 컨트랙트 이름
      {
        viewMethods: ['get_accured_pay_amount'], // 읽기 전용 메소드 이름
        changeMethods: [], // 쓰기 가능 메소드 이름 (이 예시에서는 사용하지 않음)
        useLocalViewExecution: false, // 로컬 실행 여부
      },
    );
    // 스마트 컨트랙트의 'getInfo' 메소드 호출
    const info = await contract.get_accured_pay_amount({
      service_id: serviceId,
    });

    await this.cacheManager.set(`accruedPayAmount-${serviceId}`, info, 1000);
    return info;
  }
}
