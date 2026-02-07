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
import { AnalysisWorker } from './modules/analysis/analysis.worker';

console.log('[Worker] worker.ts 已加载，即将创建应用上下文...');

async function bootstrap() {
  console.log('[Worker] 正在启动应用上下文...');
  // 创建应用上下文（不启动 HTTP 监听），并开启控制台日志
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  console.log('[Worker] 应用上下文已创建，获取 AnalysisWorker...');

  const worker = app.get(AnalysisWorker);
  console.log('[Worker] 进入任务循环（本进程将常驻，按 Ctrl+C 退出）');
  // 启动 Worker 循环（会一直阻塞在这里）
  await worker.start();

  // 正常情况下不会执行到这里，除非 worker.stop() 被调用
  await app.close();
}

bootstrap().catch((err) => {
  console.error('[Worker] 启动失败:', err);
  process.exit(1);
});
