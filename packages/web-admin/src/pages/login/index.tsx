// import { UserOutlined, LockFilled, ArrowRightOutlined } from '@ant-design/icons'

// import { Input, Button, Form, message } from 'antd'
// import { useState } from 'react'
// import { md5 } from '@kazura/web-crypto'
// import { services } from '@af-charizard/sdk-services'
// import { useStore } from '@kazura/react-mobx'
// import { useNavigate } from 'react-router-dom'
// import { UserStore } from '@af-charizard/sdk-stores'
// import styled from '@emotion/styled'

// import backgroundIMG from '~/assets/bgIMG.jpg'
// import { emailVerify } from '~/utils/verify'

// export const StyledPage = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   background-image: url(${backgroundIMG});
//   background-size: cover; /* 可选，确保背景图像覆盖整个容器 */
//   background-position: center; /* 可选，确保背景图像居中 */
//   .ant-input-affix-wrapper {
//     border-radius: 6px;
//   }
//   input {
//     height: 28px;
//   }
// `
// export const StyledButton = styled(Button)`
//   font-size: 14px;
//   width: 100%;
//   background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
//     backgroundColor} !important;
//   color: ${({
//     backgroundColor,
//     color,
//   }: {
//     backgroundColor: string
//     color: string
//   }) => color} !important;

//   height: 38px;
// `

// export const PageLogin = () => {
//   const [isDisabled, setIsDisabled] = useState(false)
//   // const [loading, setLoading] = useState(false)

//   const navigate = useNavigate()

//   const userStore = useStore(UserStore)

//   const onFinish = async (values: { email: string; password: string }) => {
//     setIsDisabled(true)

//     const passwordMd5 = md5(values.password)

//     try {
//       const resp = await services.user$login$username({
//         email: values.email,
//         password: passwordMd5,
//         response: '',
//       })
//       if (resp.data.code === 200) {
//         const resource = resp.data.resource
//         userStore.setPassport(resource.passport)
//         userStore.setUser(resource.user)
//         userStore.setStatements(resource.statements)

//         message.success('登录成功')
//         navigate('/', { replace: true })
//       } else {
//         message.error(resp.data.message)
//         setIsDisabled(false)
//         return
//       }
//     } catch (error) {}
//   }

//   return (
//     <StyledPage>
//       <div style={{ width: 300 }}>
//         {/* <div
//           style={{ textAlign: 'center', paddingBottom: 10, cursor: 'pointer' }}
//         >
//           <img
//             src="/CharizardMegaX.png"
//             style={{ width: 80, height: 80 }}
//             alt="Charizard"
//             onClick={() => navigate('/')}
//           />
//         </div> */}
//         <Form onFinish={onFinish}>
//           <Form.Item
//             name="email"
//             rules={[
//               { required: true, message: '请输入你的邮箱!' },
//               {
//                 pattern: emailVerify,
//                 message: '请输入正确的邮箱',
//               },
//             ]}
//           >
//             <Input prefix={<UserOutlined />} placeholder="请输入你的邮箱" />
//           </Form.Item>

//           <Form.Item
//             name="password"
//             rules={[{ required: true, message: '请输入密码!' }]}
//             style={{ marginBottom: 0 }}
//           >
//             <Input.Password
//               prefix={<LockFilled />}
//               placeholder="请输入你的密码"
//             />
//           </Form.Item>

//           <Button
//             type="link"
//             style={{
//               padding: 0,
//               color: '#e17189',
//               fontSize: 12,
//               marginBottom: 10,
//             }}
//             // onClick={() => message.warning('功能暂时关闭，请联系客服处理')}
//             onClick={() => navigate('/reset/password')}
//           >
//             忘记密码?
//           </Button>

//           <Form.Item>
//             <StyledButton
//               type="primary"
//               danger
//               htmlType="submit"
//               loading={isDisabled}
//               backgroundColor="#d33473"
//               color="#fff"
//               // loading={loading}
//             >
//               登入
//             </StyledButton>
//           </Form.Item>
//           <Form.Item>
//             <StyledButton
//               type="primary"
//               danger
//               onClick={() => navigate('/register')}
//               backgroundColor="#e6cdaf"
//               color="#494949"
//             >
//               新用户注册
//               <ArrowRightOutlined />
//             </StyledButton>
//           </Form.Item>
//         </Form>
//       </div>
//     </StyledPage>
//   )
// }

// export default PageLogin
import { UserOutlined, LockFilled, ArrowRightOutlined } from '@ant-design/icons'
import { Input, Button, Form, message } from 'antd'
import { useState } from 'react'
import { md5 } from '@kazura/web-crypto'
import { services } from '@af-charizard/sdk-services'
import { useStore } from '@kazura/react-mobx'
import { useNavigate } from 'react-router-dom'
import { UserStore } from '@af-charizard/sdk-stores'
import styled from '@emotion/styled'

import backgroundIMG from '~/assets/bgIMG.jpg'
import backgroundVideo from '~/assets/background-video-url.mp4'
import { emailVerify } from '~/utils/verify'

export const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;

  /* 默认是移动端样式：使用背景图 */
  background: url(${backgroundIMG}) no-repeat center center;
  background-size: cover;

  /* PC端样式：移除图片背景 */
  /* @media (min-width: 769px) {
    background: none;
  } */

  /* video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: none;
  } */

  /* 只在桌面端显示视频背景
  @media (min-width: 769px) {
    video {
      display: block;
    }
  } */

  .ant-input-affix-wrapper {
    border-radius: 6px;
  }

  input {
    height: 28px;
  }
`

export const StyledButton = styled(Button)`
  font-size: 14px;
  width: 100%;
  background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
    backgroundColor} !important;
  color: ${({
    backgroundColor,
    color,
  }: {
    backgroundColor: string
    color: string
  }) => color} !important;
  height: 38px;
`

export const PageLogin = () => {
  const [isDisabled, setIsDisabled] = useState(false)
  const navigate = useNavigate()
  const userStore = useStore(UserStore)

  const onFinish = async (values: { email: string; password: string }) => {
    setIsDisabled(true)
    const passwordMd5 = md5(values.password)

    try {
      const resp = await services.user$login$username({
        email: values.email,
        password: passwordMd5,
        response: '',
      })
      if (resp.data.code === 200) {
        const resource = resp.data.resource
        userStore.setPassport(resource.passport)
        userStore.setUser(resource.user)
        userStore.setStatements(resource.statements)
        userStore.setPurchasedMonthGoods(resource.purchasedMonthGoods || {})
        userStore.setPurchasedAnchorGoods(resource.purchasedAnchorGoods || {})
        userStore.setPurchasedAnchorUpdatePackages(
          resource.purchasedAnchorUpdatePackages || {},
        )
        console.log('1123', resource.purchasedMonthGoods)
        message.success('登录成功')
        navigate('/', { replace: true })
      } else {
        message.error(resp.data.message)
        setIsDisabled(false)
        return
      }
    } catch (error) {
      message.error('登录失败，请稍后再试')
      setIsDisabled(false)
    }
  }

  return (
    <StyledPage>
      {/* 视频背景仅在 PC 端显示 */}
      {/* <video autoPlay muted loop playsInline>
        <source src={backgroundVideo} type="video/mp4" />
        您的浏览器不支持视频播放。
      </video> */}

      <div style={{ width: 300 }}>
        <Form onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入你的邮箱!' },
              { pattern: emailVerify, message: '请输入正确的邮箱' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入你的邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
            style={{ marginBottom: 0 }}
          >
            <Input.Password
              prefix={<LockFilled />}
              placeholder="请输入你的密码"
            />
          </Form.Item>

          <Button
            type="link"
            style={{
              padding: 0,
              color: '#e17189',
              fontSize: 12,
              marginBottom: 10,
            }}
            onClick={() => navigate('/reset/password')}
          >
            忘记密码?
          </Button>

          <Form.Item>
            <StyledButton
              type="primary"
              danger
              htmlType="submit"
              loading={isDisabled}
              backgroundColor="#d33473"
              color="#fff"
            >
              登入
            </StyledButton>
          </Form.Item>

          <Form.Item>
            <StyledButton
              type="primary"
              danger
              onClick={() => navigate('/register')}
              backgroundColor="#e6cdaf"
              color="#494949"
            >
              新用户注册
              <ArrowRightOutlined />
            </StyledButton>
          </Form.Item>
        </Form>
      </div>
    </StyledPage>
  )
}

export default PageLogin
