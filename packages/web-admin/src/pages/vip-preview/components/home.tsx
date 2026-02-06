import React, { useRef, useState, useEffect, ReactElement } from 'react'
import styled from '@emotion/styled'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import Meta from 'antd/es/card/Meta'
import {
  Button,
  Card,
  UploadFile,
  UploadProps,
  message,
  GetProp,
  Input,
} from 'antd'
import dayjs from 'dayjs'
import { commonButton } from '~/components/common-header/components/web-buttons'
import { formatDateHMS } from '~/utils/date'
import { StyledTitle, StyledTop } from './favorite'
import { requireLogin } from '~/utils/requireLogin'
import Avatar from '/avatar.svg'

import { services } from '@af-charizard/sdk-services'
import { useIsMobile } from '~/hooks/useIsMobile'
import { CopyrightOutlined, SketchOutlined } from '@ant-design/icons'
import { checkMembershipStatus } from '~/utils/isVip'
import { useNavigate } from 'react-router'
import { moneyHandler } from '~/utils/money'

import ModifyModal from './modify-modal'
import { VIP_TYPE_ENUM } from '@af-charizard/sdk-types'
import CommonAvatarFrame from '~/components/common-avatar-frame'

export const StyledInfo = styled.div`
  font-size: 13px;
  margin-bottom: 3px;
`
export const StyledInfo2 = styled.div`
  font-size: 15px;
  margin: 6px 0 3px 15px;
  @media (max-width: 768px) {
    margin: 6px 0 3px 0px;
    font-size: 13px;
  }
`
export const StyledInput = styled.div`
  display: flex;
  /* width: 100%; */

  button {
    margin: 5px 0 0 15px;
    background-color: #fb7299 !important;
    border: #fb7299;

    color: #fff !important;
  }
  input {
    width: 400px;
  }
  @media (max-width: 768px) {
    display: block;
    padding-bottom: 0px;
    .icon {
      margin: 20px 0;
    }
    input {
      max-width: 210px;
      height: 32px;
      margin-top: 5px;
    }
    button {
      /* margin: 15px 10px 0 0; */
      background-color: #fb7299;
      border: #fb7299;

      color: #fff !important;
      /* font-size: 10px; */
    }
  }
`

export const StyledSign = styled.div`
  color: #fb7299;
  display: flex;
  justify-content: left;
  align-items: center;
`
export const StyledImage2 = styled.img`
  /* background-size: cover;
  background-position: center; */
  cursor: pointer;
  /* margin-top: 10px; */

  border-radius: 50% !important; // 强制圆角
  /* object-fit: cover !important; // 确保图片覆盖整个容器
  overflow: hidden !important; // 确保内容不溢出 */
`
const StyledMoney = styled.div`
  display: flex;
  font-size: 20px;
  line-height: 40px;
  padding-right: 50px;
`
const StyledIcon = styled.div`
  display: inline-block;
  padding: 1px 10px;
  border-radius: 50px; /* 圆角设置为药丸样式 */
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-align: center;
  text-transform: uppercase;

  margin-right: 3px;
  min-width: 40px;
  line-height: 1.5;

  background-color: #ffd700; /* 金色 */
`

export const StyledExchange = styled.div`
  display: flex;
  min-height: 80px;
  align-items: center;
  width: 100%;
`
const StyledPage = styled.div`
  width: 100%;

  .ant-card-body {
    height: 100%;
    padding: 15px 15px 15px 15px;

    .ant-card-meta-avatar {
      padding-inline-end: 10px;
    }

    @media (max-width: 768px) {
      padding: 15px 15px 15px 15px;
    }
  }
  .avatar_ff {
    .ant-card-body {
      height: 100%;
      padding: 27px 15px 25px 28px;

      .ant-card-meta-avatar {
        padding-inline-end: 26px;
      }

      @media (max-width: 768px) {
        .ant-card-meta-avatar {
          padding-inline-end: 16px;
        }
        padding: 20px 10px 15px 20px;
      }
    }
  }
  .ant-avatar {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 768px) {
    .ant-card {
      height: 100%;
    }
    .ant-table-cell {
      padding: 10px 10px !important;
    }
  }
  .ant-card-meta-title {
    margin-bottom: 4px !important;
  }
`

export const AvatarCpn = (data: string | undefined, wh = 60) => {
  return <StyledImage2 src={data || Avatar} style={{ width: wh, height: wh }} />
}

export const signMap = new Map<VIP_TYPE_ENUM, ReactElement>()

  .set(VIP_TYPE_ENUM.MONTH, <StyledIcon>月会员</StyledIcon>)
  .set(VIP_TYPE_ENUM.QUARTER, <StyledIcon>季会员</StyledIcon>)
  .set(VIP_TYPE_ENUM.YEAR, <StyledIcon>年会员</StyledIcon>)

  .set(
    VIP_TYPE_ENUM.THREE_YEARS,
    <StyledIcon style={{ padding: '2px 6px' }}>百年大会员</StyledIcon>,
  )
  .set(
    VIP_TYPE_ENUM.PERMANENT,
    <StyledIcon style={{ padding: '2px 6px' }}>百年大会员</StyledIcon>,
  )

interface IProps {
  setIsClicked?: React.Dispatch<React.SetStateAction<string>>
}
export const Home: React.FC<IProps> = ({ setIsClicked }) => {
  //用户信息
  const userStore = useStore(UserStore)
  const navigate = useNavigate()

  const isMobile = useIsMobile()

  const [isModalShowInfo, setIsModalShowInfo] = useState(false)
  const [cardPassword, setCardPassword] = useState('')

  const [nickname, setNickname] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [defaultFileList, setDefaultFileList] = useState<Array<UploadFile>>([])
  const fileDataRef = useRef<any>()

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

  const buyCpn = (type: string, info = '续费') => {
    return (
      <span>
        {commonButton(type)}
        <a
          style={{ marginLeft: 5 }}
          onClick={() => {
            navigate('/web/shop')
          }}
        >
          {info}
        </a>
      </span>
    )
  }
  const membershipStatus = checkMembershipStatus(userStore.user?.vipDeadLine)

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  const uploadOption: UploadProps = {
    action: `/placeholder`,
    maxCount: 1,
    listType: 'picture-card',

    accept: '.png, .jpg, .jpeg',
    // defaultFileList: defaultFileList,
    fileList: defaultFileList,
    async onChange({ file, fileList, event }) {
      if (file.status !== 'uploading') {
        if (file.response && !file.response.success) {
          // message.error(`${file.response.errorMsg}`)
          fileList = [{ ...fileList[0], status: 'error' }]
        }
      }
      if (file.status === 'error') {
        fileList = []
        message.error('上传失败,请重新上传!')
      }
      if (file.status === 'done') {
        fileDataRef.current = file as any
      }
      const suffix = file.name.slice(file.name.lastIndexOf('.') + 1)
      let flag = suffix === 'png' || suffix === 'jpg' || suffix === 'jpeg'
      if (!flag) {
        setDefaultFileList([])
      } else {
        setDefaultFileList(fileList)
      }
    },
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    beforeUpload: (file) => {
      const suffix = file.name.slice(file.name.lastIndexOf('.') + 1)
      const isLt500K = file.size! / 1024 < 1024
      if (!isLt500K) {
        message.error('上传图片大小不能超过 1MB!')
        return
      }
      let flag = suffix === 'png' || suffix === 'jpg' || suffix === 'jpeg'
      if (!flag) {
        setDefaultFileList([])

        message.error(`上传失败，仅支持上传图片文件`)
        return false
      }
      fileDataRef.current = file as any

      return false
    },

    onPreview: async (file: UploadFile) => {
      let src = file.url as string
      if (!src) {
        src = await getBase64(file.originFileObj as FileType)
      }

      const image = new window.Image(500, 500)
      image.src = src
      const imgWindow = window.open(src)
      imgWindow?.document.write(image.outerHTML)
    },
    onRemove: () => {
      setDefaultFileList([])
      fileDataRef.current = null as any
    },
  }

  /**
   * 开始导入
   */
  const handleUpload = async () => {
    if (!nickname) {
      message.warning('您还没有修改昵称')
      return
    }
    // if (!fileDataRef.current && !nickname) {
    //   message.warning('至少需要修改一个！')
    //   return
    // }
    if (nickname.length > 10) {
      message.warning('昵称最多10个字符！')
      return
    }
    setIsLoading(true)
    // const formData = new FormData()
    // formData.append('file', fileDataRef.current!)
    // formData.append('userId', userStore.user?.id)
    // formData.append('nickname', nickname)
    // const { data }: any = await services.user$upload$avatar(formData)

    const { data }: any = await services.user$upload$avatar({ nickname })

    if (data.code === 200) {
      message.success('修改成功')
      userStore.setUser({
        ...userStore.user,
        // avatar: data.resource.avatar + `?r=${Math.random()}`,
        nickname: data.resource.nickname,
      })
      setIsLoading(false)
      setIsModalShowInfo(false)
    } else {
      message.error('error')
      setIsLoading(false)
      setIsModalShowInfo(false)
    }
  }

  /**
   *兑换卡密
   */
  const exchangeHandler = async () => {
    if (!userStore.user) {
      requireLogin()
      return
    }
    if (!cardPassword) {
      message.warning('您还没有输入兑换卡密')
      return
    }
    if (cardPassword.length !== 10) {
      message.warning('卡密格式有误')
      return
    }
    setIsLoading(true)
    const resp = await services.pay$exchange$card({
      cardPassword,
    })
    if (resp.data.code === 200) {
      message.success(`兑换成功，页面即将刷新`)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isModalShowInfo) {
      setDefaultFileList([])
      setNickname('')
      fileDataRef.current = null as any
    }
  }, [isModalShowInfo])
  return (
    <StyledPage>
      <div>
        <StyledTop>
          <StyledTitle>会员中心</StyledTitle>
        </StyledTop>
        <>
          <Card
            className="avatar_ff"
            style={{
              width: `calc((100% - 20px)`,
              marginLeft: 10,
            }}
          >
            <Meta
              avatar={
                <>
                  <div>
                    <CommonAvatarFrame
                      avatar={userStore.user?.avatar}
                      selectedFrame={userStore.user?.avatarFrame}
                    ></CommonAvatarFrame>
                  </div>
                  <Button
                    style={{ marginTop: 15, marginLeft: isMobile ? -8 : 4 }}
                    type="link"
                    loading={isLoading}
                    onClick={() => setIsModalShowInfo(true)}
                  >
                    修改
                  </Button>
                </>
              }
              title={
                <span>
                  {membershipStatus.status === 'valid' ? (
                    <StyledSign>
                      <div style={{ marginBottom: 6 }}>
                        {signMap.get(userStore.user.vipType)}
                      </div>
                      <SketchOutlined
                        style={{
                          fontSize: 16,
                          marginRight: 3,
                        }}
                      />

                      {userStore.user?.nickname || '默认昵称'}
                    </StyledSign>
                  ) : membershipStatus.status === 'expired' ? (
                    <span>{userStore.user?.nickname || '默认昵称'}</span>
                  ) : userStore.user ? (
                    <span>{userStore.user?.nickname || '默认昵称'}</span>
                  ) : (
                    '未登录'
                  )}
                </span>
              }
              description={
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div>
                    <StyledInfo>
                      <span>{isMobile ? '邮箱：' : '注册邮箱：'}</span>
                      <span>{userStore.user?.email || '暂无数据'}</span>
                    </StyledInfo>
                    <StyledInfo>
                      <span>会员状态：</span>
                      <span>
                        {userStore.user?.vipDeadLine
                          ? dayjs(userStore.user.vipDeadLine) > dayjs()
                            ? buyCpn('isVip')
                            : buyCpn('passVip')
                          : buyCpn('noVip', '开通')}
                      </span>
                    </StyledInfo>
                    <StyledInfo>
                      <span> 会员积分：</span>
                      <span
                        style={{
                          color: '#28a745',
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {userStore.user?.points}
                      </span>
                    </StyledInfo>
                    <StyledInfo>
                      <span> 到期时间：</span>
                      <span>
                        {userStore.user?.vipDeadLine ? (
                          <>{formatDateHMS(userStore.user.vipDeadLine)}</>
                        ) : (
                          '暂无'
                        )}
                      </span>
                    </StyledInfo>
                  </div>
                  {!isMobile && (
                    <div>
                      <StyledMoney>
                        <span>账户余额：</span>
                        <span style={{ color: '#FB7299', fontSize: 30 }}>
                          {moneyHandler(userStore.user?.money)}
                        </span>
                        <span>
                          <CopyrightOutlined style={{ marginLeft: 10 }} />
                        </span>

                        <Button
                          danger
                          style={{
                            margin: '5px 0 0 15px',
                            backgroundColor: '#FB7299',
                            color: '#fff',
                          }}
                          onClick={() => {
                            // message.warning(
                            //   '充值请联系客服Q：1946742459、3768637494',
                            // )
                            // return
                            window.open(
                              'https://shop.autofaka.com//links/4C7BA277',
                            )
                          }}
                        >
                          充值
                        </Button>
                      </StyledMoney>
                    </div>
                  )}
                </div>
              }
            />
          </Card>
          <Card
            style={{
              width: `calc((100% - 20px)`,
              marginLeft: 10,
              marginTop: 20,
            }}
          >
            <Meta
              title={<div>自助兑换卡密</div>}
              description={
                <StyledExchange>
                  <StyledInput>
                    {isMobile && (
                      <StyledInfo
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ minWidth: 200 }}>
                          <span> 余额：</span>
                          <span style={{ color: '#FB7299', fontSize: 20 }}>
                            {moneyHandler(userStore.user?.money)}
                          </span>
                          <span>
                            <CopyrightOutlined style={{ marginLeft: 5 }} />
                          </span>
                        </div>
                        <div>
                          <Button
                            danger
                            onClick={() => {
                              // message.warning(
                              //   '充值请联系客服Q：1946742459、3768637494',
                              // )
                              // return
                              window.open(
                                'https://shop.autofaka.com//links/4C7BA277',
                              )
                            }}
                          >
                            充值
                          </Button>
                        </div>
                      </StyledInfo>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Input
                        value={cardPassword}
                        onChange={(e) => setCardPassword(e.target.value.trim())}
                        placeholder="请输入获取的卡密"
                      ></Input>
                      <Button
                        danger
                        onClick={exchangeHandler}
                        loading={isLoading}
                      >
                        兑换
                      </Button>
                    </div>
                    <StyledInfo2>
                      充值成功后，请复制获得的卡密，粘贴到输入框进行兑换
                    </StyledInfo2>
                  </StyledInput>
                </StyledExchange>
              }
            />
          </Card>
        </>

        <ModifyModal
          isModalShow={isModalShowInfo}
          setIsModalShow={setIsModalShowInfo}
          oKHandler={handleUpload}
          uploadOption={uploadOption}
          nickname={nickname}
          setNickname={setNickname}
          isLoading={isLoading}
        ></ModifyModal>
      </div>
    </StyledPage>
  )
}
