// hooks/useSendButton.ts
import { useState, useEffect } from 'react'
import { FormInstance } from 'antd'
import { message } from 'antd'
import { emailVerify } from '~/utils/verify'

interface SendEmailServiceResponse {
  data: {
    code: number
    message: string
  }
}

type SendEmailService = (data: {
  email: string
}) => Promise<SendEmailServiceResponse>

export const useSendButton = (
  form: FormInstance,
  sendEmailService: SendEmailService,
) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [counter, setCounter] = useState<number>(60)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isDisabled && counter > 0) {
      timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1)
      }, 1000)
    } else if (counter === 0) {
      setIsDisabled(false)
      setCounter(60)
    }
    return () => clearInterval(timer)
  }, [isDisabled, counter])

  const sendCodeHandler = async () => {
    const email = form.getFieldValue('email')

    if (!emailVerify.test(email)) {
      message.warning('邮箱格式有误')
      return
    }

    setLoading(true)

    try {
      const resp = await sendEmailService({ email })

      if (resp.data.code !== 200) {
        message.error(resp.data.message)
        setIsDisabled(false)
      } else {
        message.success('发送成功')
        setIsDisabled(true)
      }
    } catch (error) {
      message.error('发送失败，请稍后重试')
      setIsDisabled(false)
    } finally {
      setLoading(false)
    }
  }

  return {
    isDisabled,
    loading,
    counter,
    sendCodeHandler,
  }
}
