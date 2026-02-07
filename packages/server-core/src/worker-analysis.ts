// 分析 Worker 独立入口：仅跑智能体分析，可多进程部署以支持多人同时使用
process.on('uncaughtException', (err) => {
  console.error('[AnalysisWorker] uncaughtException:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('[AnalysisWorker] unhandledRejection:', reason, p);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { AnalysisWorker } from './modules/analysis/analysis.worker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  const worker = app.get(AnalysisWorker);
  console.log('[AnalysisWorker] 分析 Worker 已启动（可多开进程扩缩容，按 Ctrl+C 退出）');
  await worker.start();
  await app.close();
}

bootstrap().catch((err) => {
  console.error('[AnalysisWorker] 启动失败:', err);
  process.exit(1);
});
