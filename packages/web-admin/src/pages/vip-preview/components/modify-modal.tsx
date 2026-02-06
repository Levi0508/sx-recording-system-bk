import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Upload, UploadProps } from 'antd'

import { useIsMobile } from '~/hooks/useIsMobile'
import ImgCrop from 'antd-img-crop'

interface IProps {
  isModalShow: boolean
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>
  oKHandler: () => Promise<void>
  uploadOption: UploadProps<any>
  nickname: string
  setNickname: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
}
const ModifyModal: React.FC<IProps> = ({
  isModalShow,
  setIsModalShow,
  oKHandler,
  uploadOption,
  nickname,
  setNickname,
  isLoading,
}) => {
  const isMobile = useIsMobile()

  return (
    <Modal
      width={isMobile ? '350px' : '600px'}
      destroyOnClose
      open={isModalShow}
      onCancel={() => setIsModalShow(false)}
      footer={
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Button
            key="back"
            onClick={() => setIsModalShow(false)}
            style={{ marginRight: 30 }}
          >
            取消
          </Button>
          <Button
            key="ok"
            type="primary"
            loading={isLoading}
            onClick={oKHandler}
            style={{ backgroundColor: '#FB7299', color: '#fff' }}
          >
            确认
          </Button>
        </div>
      }
    >
      <>
        {/* <Form.Item label="头像" name="upload" style={{ marginTop: 20 }}>
          <ImgCrop aspectSlider showReset>
            <Upload {...uploadOption}>
              <button
                style={{
                  border: 1,
                  background: 'none',
                  cursor: 'pointer',
                }}
                type="button"
              >
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传头像</div>
              </button>
            </Upload>
          </ImgCrop>
        </Form.Item> */}
        <Form.Item label="昵称" name="nickname" style={{ marginTop: 30 }}>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="请输入昵称"
          />
        </Form.Item>
      </>
    </Modal>
  )
}

export default ModifyModal
