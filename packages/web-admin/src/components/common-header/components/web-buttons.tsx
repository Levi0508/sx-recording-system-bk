import {
  CheckCircleOutlined,
  CopyrightOutlined,
  FireFilled,
  FireOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  ProductOutlined,
  SketchOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Badge, Button, message } from 'antd'

import { defineFunctionComponent } from '@kazura/react-toolkit'
import { useNavigate } from 'react-router'
import { useStore } from '@kazura/react-mobx'
import { UserStore, MailStore } from '@af-charizard/sdk-stores'
import { services } from '@af-charizard/sdk-services'
import Avatar from '/avatar.svg'

import { noop } from '@kazura/common'
import SearchComponent from './search-cpn'
import styled from '@emotion/styled'
import { checkMembershipStatus } from '~/utils/isVip'
import { useState } from 'react'
import { useMount } from 'ahooks'
import { INotificationList } from '@af-charizard/sdk-services/src/services/notification$receive$read'
import { usePagination } from '~/hooks'
import CommonIdCardHome from '~/components/common-id-card-home'

const StyledImage = styled.img`
  width: 35px !important; // 强制宽度
  height: 35px !important; // 强制高度
  border-radius: 50% !important; // 强制圆角
  object-fit: cover !important; // 确保图片覆盖整个容器
  overflow: hidden !important; // 确保内容不溢出
  margin-right: 10px;
`
export const commonButton = (type: string) => {
  switch (type) {
    case 'isVip':
      return (
        <span style={{ color: '#28a745', fontSize: 13, fontWeight: 500 }}>
          已开通会员
        </span>
      )
    case 'noVip':
      return <span>未开通会员</span>
    case 'passVip':
      return <span style={{ color: '#bfbfbf' }}>会员已过期</span>
  }
}

interface IProps {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}
export const WebButtons: React.FC<IProps> = defineFunctionComponent(
  ({ expanded, setExpanded }) => {
    const navigate = useNavigate()
    const userStore = useStore(UserStore)
    const mailStore = useStore(MailStore)

    const { tableParams, handleTableChange } = usePagination(10)

    /**
     * 登出
     */
    const logoutHandler = async () => {
      localStorage.removeItem('__PASSPORT')

      await services.user$logout()
      const resp2 = await services.passport$create({})

      userStore.setPassport(resp2.data.resource.passport)
      userStore.setUser(resp2.data.resource.user)
      userStore.setStatements(resp2.data.resource.statements)
      userStore.setPurchasedMonthGoods(resp2.data.resource.purchasedMonthGoods || {})
      userStore.setPurchasedAnchorGoods(resp2.data.resource.purchasedAnchorGoods || {})
      userStore.setPurchasedAnchorUpdatePackages(
        resp2.data.resource.purchasedAnchorUpdatePackages || {},
      )

      localStorage.setItem('__PASSPORT', resp2.data.resource.passport.token)
      message.success('退出成功')
      navigate('/')
    }
    /**
     * 跳转
     */
    const navigateHandler = (URL: string) => {
      navigate(URL)
    }

    //web
    // const webItems: MenuProps['items'] = [
    //   {
    //     key: 'email',
    //     label: (
    //       <StyledItems>
    //         <StyledItemsTitle>账号：</StyledItemsTitle>
    //         {userStore.user?.email}
    //       </StyledItems>
    //     ),
    //   },
    //   {
    //     key: 'money',
    //     label: (
    //       <StyledItems>
    //         <StyledItemsTitle>账户余额：</StyledItemsTitle>
    //         <span style={{ color: '#FB7299', fontSize: 16 }}>
    //           {(userStore.user?.money / 10).toFixed(1) ?? 0.0}
    //         </span>
    //         <CopyrightOutlined style={{ marginLeft: 5 }}></CopyrightOutlined>
    //       </StyledItems>
    //     ),
    //   },
    //   {
    //     key: 'vip-status',
    //     label: (
    //       <StyledItems>
    //         <StyledItemsTitle>会员状态：</StyledItemsTitle>

    //         {userStore.user?.vipDeadLine
    //           ? dayjs(userStore.user.vipDeadLine) > dayjs()
    //             ? commonButton('isVip')
    //             : commonButton('passVip')
    //           : commonButton('noVip')}
    //       </StyledItems>
    //     ),
    //   },
    //   ...[
    //     userStore.user?.vipDeadLine && {
    //       key: 'expiration-time',
    //       label: (
    //         <StyledItems>
    //           <StyledItemsTitle>到期时间：</StyledItemsTitle>
    //           {formatDateHMS(userStore.user.vipDeadLine)}
    //         </StyledItems>
    //       ),
    //     },
    //   ],
    //   {
    //     key: 'exit',
    //     label: (
    //       <StyledItems style={{ textAlign: 'center' }} onClick={logoutHandler}>
    //         <Button
    //           icon={<LogoutOutlined />}
    //           type="text"
    //           style={{ color: 'red' }}
    //         >
    //           退出账号
    //         </Button>
    //       </StyledItems>
    //     ),
    //   },
    // ]
    const membershipStatus = checkMembershipStatus(userStore.user?.vipDeadLine)
    /**
     * 查询未读消息
     */
    const getUnreadMail = async () => {
      const resp = await services.notification$receive$unread({
        ...tableParams,
      })

      if (resp.data.code === 200) {
        mailStore.setUnreadMail(resp.data.resource.list as INotificationList[])
        mailStore.setTotalCount(resp.data.resource.totalCount)
      } else {
        mailStore.setUnreadMail([])
        mailStore.setTotalCount(0)
      }
    }
    const [isUserModalShow, setIsUserModalShow] = useState(false)

    useMount(() => {
      getUnreadMail()
    })
    return (
      <>
        {/* <SearchComponent expanded={expanded} setExpanded={setExpanded} /> */}
        {/* <Dropdown
        menu={{ items: userStore.user ? webItems : [] }}
        placement="bottomLeft"
        trigger={['click', 'hover']}
      >
        <Button
          icon={!userStore.user && <UserOutlined />}
          type="text"
          onClick={userStore.user ? noop : () => navigateHandler('/login')}
        >
          <span>
            {membershipStatus.status === 'valid' ? (
              <div style={{ color: '#FB7299', fontWeight: 500 }}>
                <StyledImage
                  width={30}
                  height={30}
                  src={userStore.user?.avatar || Avatar}
                ></StyledImage>
                <span>{userStore.user?.nickname || '默认昵称'}</span>
              </div>
            ) : membershipStatus.status === 'expired' ? (
              <span style={{ fontWeight: 500 }}>
                <StyledImage
                  width={30}
                  height={30}
                  src={userStore.user?.avatar || Avatar}
                ></StyledImage>
                {userStore.user?.nickname || '默认昵称'}
              </span>
            ) : userStore.user ? (
              <span style={{ fontWeight: 500 }}>
                <StyledImage
                  width={30}
                  height={30}
                  src={userStore.user?.avatar || Avatar}
                ></StyledImage>
                {userStore.user?.nickname || '默认昵称'}
              </span>
            ) : (
              '未登录'
            )}
          </span>
        </Button>
      </Dropdown> */}
        <Button
          icon={!userStore.user && <UserOutlined />}
          type="text"
          onClick={userStore.user ? noop : () => navigateHandler('/login')}
        >
          <span
            onClick={() => setIsUserModalShow(true)}
            style={{ marginLeft: 10 }}
          >
            {membershipStatus.status === 'valid' ? (
              <div style={{ color: '#FB7299', fontWeight: 500 }}>
                <StyledImage
                  width={30}
                  height={30}
                  src={userStore.user?.avatar || Avatar}
                ></StyledImage>
                <span>{userStore.user?.nickname || '默认昵称'}</span>
              </div>
            ) : membershipStatus.status === 'expired' ? (
              <span style={{ fontWeight: 500 }}>
                <StyledImage
                  width={30}
                  height={30}
                  src={userStore.user?.avatar || Avatar}
                ></StyledImage>
                {userStore.user?.nickname || '默认昵称'}
              </span>
            ) : userStore.user ? (
              <span style={{ fontWeight: 500 }}>
                <StyledImage
                  width={30}
                  height={30}
                  src={userStore.user?.avatar || Avatar}
                ></StyledImage>
                {userStore.user?.nickname || '默认昵称'}
              </span>
            ) : (
              '未登录'
            )}
          </span>
        </Button>
        <Button
          icon={<HomeOutlined />}
          type="text"
          onClick={() => navigateHandler('/')}
        >
          首页
        </Button>
        {/* <Button
          icon={<FireFilled style={{ color: 'red' }} />}
          type="text"
          onClick={() => navigateHandler('/web/sign-in')}
        >
          签到
        </Button> */}
        {/* <Button
          icon={<ProductOutlined />}
          type="text"
          onClick={() => navigateHandler('/classification')}
        >
          分类
        </Button> */}

        <Button
          icon={<SketchOutlined />}
          type="text"
          // onClick={() => navigateHandler('/vip/shop')}
          onClick={() => navigateHandler('/web/shop')}
          style={{ color: '#ea7a99', fontWeight: 500 }}
        >
          会员商城
        </Button>

        {!userStore.user && (
          <>
            <Button
              icon={<LoginOutlined />}
              type="text"
              onClick={() => navigateHandler('/login')}
            >
              登录
            </Button>
            <Button
              icon={<SmileOutlined />}
              type="text"
              onClick={() => navigateHandler('/register')}
            >
              注册
            </Button>
          </>
        )}

        {userStore.user && (
          <>
            <Badge
              count={mailStore.totalCount}
              offset={[-10, 15]}
              overflowCount={99}
            >
              <Button
                icon={<MailOutlined />}
                type="text"
                onClick={() => {
                  getUnreadMail()

                  navigate('/mail/message')
                }}
              >
                消息
              </Button>
            </Badge>

            <Button
              icon={<UserOutlined />}
              type="text"
              onClick={() =>
                navigate('/vip/buy', { state: { type: 'vip-center' } })
              }
            >
              会员中心
            </Button>
            {/* <Button
            icon={<DesktopOutlined />}
            type="text"
            onClick={() => window.open('/#/dashboard', '_blank')}
          >
            后台
          </Button> */}
          </>
        )}
        <CommonIdCardHome
          isModalShow={isUserModalShow}
          setIsModalShow={setIsUserModalShow}
          userId={userStore.user?.id}
          type="web"
        ></CommonIdCardHome>
      </>
    )
  },
)
