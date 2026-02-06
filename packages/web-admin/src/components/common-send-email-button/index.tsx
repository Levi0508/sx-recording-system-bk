import React from 'react'
import { Button } from 'antd'
import { FormInstance } from 'antd'
import { useSendButton } from '~/hooks/useSendButton'

interface SendButtonProps {
  form: FormInstance
  sendEmailService: (data: {
    email: string
  }) => Promise<{ data: { code: number; message: string } }>
}

export const CommonSendButton: React.FC<SendButtonProps> = ({
  form,
  sendEmailService,
}) => {
  const { isDisabled, loading, counter, sendCodeHandler } = useSendButton(
    form,
    sendEmailService,
  )

  return (
    <Button
      type="primary"
      onClick={sendCodeHandler}
      loading={loading}
      disabled={isDisabled}
      style={{
        marginLeft: 10,
        height: 38,
        width: 100,
        backgroundColor: '#d33473',
        borderColor: '#d33473',
        color: '#fff',
      }}
      danger
    >
      {isDisabled ? `${counter} 秒` : '发送验证码'}
    </Button>
  )
}
