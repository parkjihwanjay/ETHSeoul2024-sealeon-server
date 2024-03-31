import { NestFactory } from '@nestjs/core';
import { SeaLeonModule } from './sealeon.module';
import { ProxyModule } from './proxy.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(SeaLeonModule);
  // const proxyApp = await NestFactory.create(ProxyModule);

  app.enableCors({ origin: '*' });
  // proxyApp.enableCors({ origin: '*' });

  // proxyApp.use(
  //   '*',
  //   createProxyMiddleware({
  //     target: 'https://f7b519ecaf7e528f03.gradio.live',
  //     changeOrigin: true,
  //   }),
  // );

  await app.listen(3000, '0.0.0.0');

  // await proxyApp.listen(3001, '0.0.0.0');
}
bootstrap();
