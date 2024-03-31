// my.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SeaLeonService } from './sealeon.service';
import * as httpProxyMiddleware from 'http-proxy-middleware';
import { parse } from 'url';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(private readonly moduleRef: ModuleRef) {}

  use(req: any, res: any, next: () => void) {
    const sealeonService = this.moduleRef.get(SeaLeonService, {
      strict: false,
    });

    const staticFilesRegex = /\.(css|js|png|jpg|jpeg|gif|svg)$/;

    console.log(req.baseUrl);
    if (staticFilesRegex.test(req.baseUrl)) {
      console.log('yes');
      const proxy = httpProxyMiddleware.createProxyMiddleware({
        target: 'https://f7b519ecaf7e528f03.gradio.live',
        changeOrigin: true,
      });

      proxy(req, res, next);
    } else if (req.baseUrl.startsWith('/gradio')) {
      const parsedUrl = parse(req.baseUrl, true);
      const paths = parsedUrl.pathname
        ?.split('/')
        .filter((path) => path.length > 0);

      const secretHash = paths[1];

      sealeonService
        .getProxyPath(secretHash)
        .then((path) => {
          if (path) {
            // const baseUrlWithoutParams = req.baseUrl.split('?')[0]; // 쿼리 스트링 제거
            // console.log('a', baseUrlWithoutParams);
            // const pathToProxy = baseUrlWithoutParams.replace(/^\/gradio/, ''); // '/gradio'를 제거하여 경로 재작성
            // console.log('b', pathToProxy);

            const proxy = httpProxyMiddleware.createProxyMiddleware({
              target: path,
              changeOrigin: true,
              // pathRewrite: {
              //   '^/gradio': '',
              //   // css, js, png, jpg, jpeg, gif, svg 확장자 파일은 그대로 요청
              // },
              pathRewrite: (path, req) => {
                console.log(path);
                const staticFilesRegex = /\.(css|js|png|jpg|jpeg|gif|svg)$/;
                if (staticFilesRegex.test(path)) {
                  console.log('testing');
                  return path;
                }
                return '/';

                // `/gradio`로 시작하는 요청 경로를 분석합니다.
                const match = path.match(/^\/gradio\/([^\/]+)(\/.*)?$/);
                console.log(match);
                if (match) {
                  // `/gradio/asadf` 요청인 경우, 대상 경로를 `/`로 재작성합니다.

                  if (!match[1]) return '/';

                  return match[1];

                  if (match[1] && !match[2]) {
                    return '/';
                  }

                  // if (path.match(/\.(css|js|png|jpg|jpeg|gif|svg)$/)) {
                  //   return `/gradio/${match[1]}/{path}`;
                  // }
                  // `/gradio/asdf/123` 같이 특정 문자열 다음에 추가 경로가 있는 경우,
                  // 추가 경로(`/123`)로 재작성합니다.
                  if (match[2]) {
                    return match[2];
                  }
                }
                // 기본적으로는 요청 경로를 변경하지 않습니다.
                return path;
              },
            });

            proxy(req, res, next);
          } else {
            next();
          }
        })
        .catch((e) => {
          console.error(e);
          next();
        });
    } else if (req.baseUrl.startsWith('/gradio-api')) {
      const parsedUrl = parse(req.baseUrl, true);
      const paths = parsedUrl.pathname
        ?.split('/')
        .filter((path) => path.length > 0);

      const secretHash = paths[1];
      sealeonService
        .getProxyPath(secretHash)
        .then((path) => {
          if (path) {
            const proxy = httpProxyMiddleware.createProxyMiddleware({
              target: `${path}:3000`,
              changeOrigin: true,
            });

            proxy(req, res, next);
          } else {
            next();
          }
        })
        .catch((e) => {
          console.error(e);
          next();
        });
    } else {
      next();
    }
  }
}
