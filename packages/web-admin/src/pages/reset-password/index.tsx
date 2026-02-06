import { UserOutlined, MailOutlined, LockFilled } from '@ant-design/icons'
import { useMount } from 'ahooks'
import { Input, Form, message } from 'antd'
import { useState } from 'react'
import { md5 } from '@kazura/web-crypto'
import { services } from '@af-charizard/sdk-services'
import { useStore } from '@kazura/react-mobx'
import { useNavigate } from 'react-router-dom'
import { UserStore } from '@af-charizard/sdk-stores'
import { StyledPage, StyledButton } from '../login'
import { CommonSendButton } from '~/components/common-send-email-button'
import { emailVerify } from '~/utils/verify'

export const PageResetPassword = () => {
  const [isDisabled, setIsDisabled] = useState(false)
  const [form] = Form.useForm()

  const navigate = useNavigate()

  const userStore = useStore(UserStore)

  /**
   * 注册
   * @param values
   * @returns
   */
  const onFinish = async (values: {
    email: string
    code: string
    password: string
    're-password': string
  }) => {
    if (values.password !== values['re-password']) {
      message.warning('两次输入的密码不一致')
      return
    }
    setIsDisabled(true)

    const passwordMd5 = md5(values.password)

    const resp = await services.user$reset$password({
      email: values.email,
      password: passwordMd5,
      code: values.code,
      response: '',
    })

    if (resp.data.code !== 200) {
      // reset()
      message.error(resp.data.message)
      setIsDisabled(false)
      return
    }
    localStorage.removeItem('__PASSPORT')
    const resp2 = await services.passport$create({})

    userStore.setPassport(resp2.data.resource.passport)
    userStore.setUser(resp2.data.resource.user)
    userStore.setStatements(resp2.data.resource.statements)

    localStorage.setItem('__PASSPORT', resp2.data.resource.passport.token)
    message.success('改密成功')
    navigate('/login', { replace: true })
  }

  useMount(() => {
    if (userStore.user) {
      navigate('/')
      message.warning('用户已登陆')
    }
  })

  return (
    <StyledPage>
      <div style={{ width: 300 }}>
        <Form onFinish={onFinish} form={form}>
          <Form.Item
            name="email"
            style={{ width: '100%' }}
            rules={[
              { required: true, message: '请输入你的邮箱!' },
              {
                pattern: emailVerify,
                message: '请输入正确的邮箱',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入你的邮箱" />
          </Form.Item>
          <div style={{ display: 'flex' }}>
            <Form.Item
              name="code"
              rules={[
                { required: true, message: '请输入你的邮箱验证码!' },
                {
                  min: 6,
                  message: '验证码格式不正确',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="请输入你的邮箱验证码"
                maxLength={6}
              />
            </Form.Item>
            <CommonSendButton
              form={form}
              sendEmailService={services.email$sendCode$resetPassword}
            />
          </div>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入你的密码!' }]}
          >
            <Input.Password
              prefix={<LockFilled />}
              placeholder="请输入你的密码"
            />
          </Form.Item>
          <Form.Item
            name="re-password"
            rules={[{ required: true, message: '请再次输入你的密码!' }]}
          >
            <Input.Password
              prefix={<LockFilled />}
              placeholder="确认密码"
              visibilityToggle={true}
            />
          </Form.Item>
          <Form.Item>
            <StyledButton
              backgroundColor="#d33473"
              color="#fff"
              type="primary"
              htmlType="submit"
              // disabled={isDisabled}
              loading={isDisabled}
            >
              确认修改
            </StyledButton>
          </Form.Item>
          <Form.Item>
            <StyledButton
              backgroundColor="#e6cdaf"
              color="#494949"
              type="primary"
              onClick={() => navigate('/login')}
            >
              返回登录
            </StyledButton>
          </Form.Item>
        </Form>
      </div>
    </StyledPage>
  )
}

export default PageResetPassword
