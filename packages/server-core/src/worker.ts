// 确保任何未捕获错误都能在退出前打印
process.on('uncaughtException', (err) => {
  console.error('[Worker] uncaughtException:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('[Worker] unhandledRejection:', reason, p);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { TranscriptWorker } from './modules/analysis/transcript.worker';
import { AnalysisWorker } from './modules/analysis/analysis.worker';

console.log('[Worker] worker.ts 已加载，即将创建应用上下文...');

async function bootstrap() {
  console.log('[Worker] 正在启动应用上下文...');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  console.log('[Worker] 应用上下文已创建，启动转写 Worker 与分析 Worker...');

  const transcriptWorker = app.get(TranscriptWorker);
  const analysisWorker = app.get(AnalysisWorker);
  console.log(
    '[Worker] 转写/分析双 Worker 已启动（本进程常驻，按 Ctrl+C 退出）',
  );
  await Promise.all([transcriptWorker.start(), analysisWorker.start()]);

  await app.close();
}

bootstrap().catch((err) => {
  console.error('[Worker] 启动失败:', err);
  process.exit(1);
});
