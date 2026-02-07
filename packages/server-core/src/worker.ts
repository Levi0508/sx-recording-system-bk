import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { AnalysisWorker } from './modules/analysis/analysis.worker';

async function bootstrap() {
  // 创建应用上下文（不启动 HTTP 监听）
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // 获取 Worker 实例
  const worker = app.get(AnalysisWorker);
  
  // 启动 Worker 循环
  // 注意：这会阻塞主线程，直到应用退出
  await worker.start();
  
  // 正常情况下不会执行到这里，除非 worker.stop() 被调用
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Worker failed to start', err);
  process.exit(1);
});
