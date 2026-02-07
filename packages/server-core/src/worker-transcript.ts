// 转写 Worker 独立入口：仅跑 ASR，可多进程部署以支持多人同时使用
process.on('uncaughtException', (err) => {
  console.error('[TranscriptWorker] uncaughtException:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('[TranscriptWorker] unhandledRejection:', reason, p);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { TranscriptWorker } from './modules/analysis/transcript.worker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  const worker = app.get(TranscriptWorker);
  console.log('[TranscriptWorker] 转写 Worker 已启动（可多开进程扩缩容，按 Ctrl+C 退出）');
  await worker.start();
  await app.close();
}

bootstrap().catch((err) => {
  console.error('[TranscriptWorker] 启动失败:', err);
  process.exit(1);
});
