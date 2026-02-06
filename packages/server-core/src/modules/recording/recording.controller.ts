import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BaseController } from 'src/base/BaseController';
import { CreateSessionDTO } from './dtos/create-session.dto';
import { UploadChunkDTO } from './dtos/upload-chunk.dto';
import { CompleteSessionDTO } from './dtos/complete-session.dto';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import * as fs from 'fs';
import * as path from 'path';
import { RecordingService } from './recording.service';

@Controller('recording')
export class RecordingController extends BaseController {
  constructor(private readonly recordingService: RecordingService) {
    super();
  }

  @Post('session')
  async createSession(@Body() dto: CreateSessionDTO) {
    const result = await this.recordingService.createSession(dto);
    return this.success(result);
  }

  @Post('chunk')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // 临时存放目录，Service 层会移动到最终目录
          // 使用 process.cwd() 确保路径一致
          const tempDir = path.join(process.cwd(), 'uploads', 'temp');
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
          cb(null, tempDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
    }),
  )
  async uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadChunkDTO, // 不使用 @ProtocolResource，因为它只支持 JSON 且有格式校验
  ) {
    if (!file) {
      throw new Error('File is required');
    }

    // 手动处理类型转换 (multipart/form-data 传输过来通常是 string)
    let sessionId = body.sessionId?.trim();
    
    // 严格校验 sessionId，防止前端传 "undefined", "null" 或空字符串
    if (!sessionId || sessionId === 'undefined' || sessionId === 'null') {
      console.error('[uploadChunk] Invalid sessionId:', body.sessionId);
      throw new Error(`Invalid sessionId: ${body.sessionId}`);
    }

    const dto: UploadChunkDTO = {
      sessionId,
      chunkId: Number(body.chunkId),
      duration: Number(body.duration),
    };

    console.log(`[uploadChunk] Processing: sessionId=[${dto.sessionId}], chunkId=${dto.chunkId}`);

    const result = await this.recordingService.handleChunkUpload(dto, file);
    return this.success(result);
  }

  @Post('complete')
  async completeSession(@Body() dto: CompleteSessionDTO) {
    const result = await this.recordingService.completeSession(dto.sessionId!);
    return this.success(result);
  }

  @Get('session/:sessionId/chunks')
  async getUploadedChunks(@Param('sessionId') sessionId: string) {
    console.log(`[getUploadedChunks] Request for session: ${sessionId}`);
    const chunkIds = await this.recordingService.getUploadedChunks(sessionId);
    console.log(`[getUploadedChunks] Found ${chunkIds.length} chunks:`, chunkIds);
    return this.success(chunkIds);
  }
}
