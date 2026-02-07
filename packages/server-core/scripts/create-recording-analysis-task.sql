-- 分析任务表（Worker 消费）
-- 若项目配置了 MYSQL_TABLE_PREFIX（如 clf_），请把表名改为 prefix_recording_analysis_task
CREATE TABLE IF NOT EXISTS recording_analysis_task (
  id INT PRIMARY KEY AUTO_INCREMENT,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  session_id VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  version VARCHAR(64) NULL,
  result TEXT NULL,
  error_message VARCHAR(512) NULL,
  UNIQUE KEY uk_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
