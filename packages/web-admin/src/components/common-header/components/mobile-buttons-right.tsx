import { LogoutOutlined, CopyrightOutlined } from '@ant-design/icons'
import { Badge, Button, Dropdown, MenuProps, message } from 'antd'

import { defineFunctionComponent } from '@kazura/react-toolkit'
import { StyledItems, StyledItemsTitle } from '..'
import { useNavigate } from 'react-router'
import { useStore } from '@kazura/react-mobx'
import { MailStore, UserStore } from '@af-charizard/sdk-stores'
import dayjs from 'dayjs'
import { commonButton } from './web-buttons'
import { formatDateHM } from '~/utils/date'
import SearchComponent from './search-cpn'
import { useLogout } from '~/hooks'
import styled from '@emotion/styled'
import Avatar from '/avatar.svg'
import { useState } from 'react'
import CommonIdCardHome from '~/components/common-id-card-home'
import { moneyHandler } from '~/utils/money'

const StyledImage = styled.img`
  width: 35px !important; // 强制宽度
  height: 35px !important; // 强制高度
  border-radius: 50% !important; // 强制圆角
  object-fit: cover !important; // 确保图片覆盖整个容器
  overflow: hidden !important; // 确保内容不溢出
  margin-right: 5px;
`

interface IProps {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}
export const MobileButtonsRight: React.FC<IProps> = defineFunctionComponent(
  ({ expanded, setExpanded }) => {
    const navigate = useNavigate()
    const userStore = useStore(UserStore)
    const mailStore = useStore(MailStore)

    const logoutHandler = useLogout()

    //mobile用户信息
    // const mobileUserInfo: MenuProps['items'] = [
    //   ...(userStore.user
    //     ? [
    //         {
    //           key: 'email',
    //           label: (
    //             <StyledItems>
    //               <StyledItemsTitle>账号：</StyledItemsTitle>
    //               {userStore.user?.email}
    //             </StyledItems>
    //           ),
    //         },
    //         {
    //           key: 'money',
    //           label: (
    //             <StyledItems>
    //               <StyledItemsTitle>账户余额：</StyledItemsTitle>
    //               <span
    //                 style={{ color: '#FB7299', fontSize: 18, fontWeight: 400 }}
    //               >
    //                 {moneyHandler(userStore.user.money)}
    //               </span>
    //               <CopyrightOutlined
    //                 style={{ paddingLeft: 5 }}
    //               ></CopyrightOutlined>
    //             </StyledItems>
    //           ),
    //         },

    //         {
    //           key: 'vip-status',
    //           label: (
    //             <StyledItems>
    //               <StyledItemsTitle>会员状态：</StyledItemsTitle>

    //               {userStore.user?.vipDeadLine
    //                 ? dayjs(userStore.user.vipDeadLine) > dayjs()
    //                   ? commonButton('isVip')
    //                   : commonButton('passVip')
    //                 : commonButton('noVip')}
    //             </StyledItems>
    //           ),
    //         },
    //         ...[
    //           userStore.user?.vipDeadLine && {
    //             key: 'expiration-time',
    //             label: (
    //               <StyledItems>
    //                 <StyledItemsTitle>到期时间：</StyledItemsTitle>
    //                 {formatDateHM(userStore.user.vipDeadLine)}
    //               </StyledItems>
    //             ),
    //           },
    //         ],

    //         {
    //           key: 'exit',
    //           label: (
    //             <StyledItems style={{ textAlign: 'center' }}>
    //               <Button
    //                 icon={<LogoutOutlined />}
    //                 type="text"
    //                 danger
    //                 onClick={logoutHandler}
    //               >
    //                 退出账号
    //               </Button>
    //             </StyledItems>
    //           ),
    //         },
    //       ]
    //     : [
    //         {
    //           key: 'email',
    //           label: (
    //             <StyledItems>
    //               <StyledItemsTitle>账号：</StyledItemsTitle>
    //               未登录
    //             </StyledItems>
    //           ),
    //         },

    //         {
    //           key: 'login',
    //           label: (
    //             <StyledItems style={{ textAlign: 'center' }}>
    //               <Button
    //                 icon={<LogoutOutlined />}
    //                 type="text"
    //                 style={{ color: 'green' }}
    //                 onClick={() => navigate('/login')}
    //               >
    //                 登录
    //               </Button>
    //             </StyledItems>
    //           ),
    //         },
    //       ]),
    // ]
    const [isUserModalShow, setIsUserModalShow] = useState(false)
    return (
      <>
        {/* <SearchComponent expanded={expanded} setExpanded={setExpanded} /> */}

        {!expanded && (
          <Badge
            count={mailStore.totalCount}
            offset={[-37, 2]}
            overflowCount={99}
            size="small"
          >
            <span
              onClick={() => setIsUserModalShow(true)}
              style={{ marginLeft: 10 }}
            >
              <StyledImage
                width={30}
                height={30}
                src={userStore.user?.avatar || Avatar}
              ></StyledImage>
            </span>
          </Badge>
        )}

        <CommonIdCardHome
          isModalShow={isUserModalShow}
          setIsModalShow={setIsUserModalShow}
          userId={userStore.user?.id}
          type="mobile"
        ></CommonIdCardHome>
        {/* <Dropdown
        menu={{ items: mobileUserInfo }}
        placement="bottomLeft"
        trigger={['click']}
      >
        {
          <span>
            <StyledImage
              width={30}
              height={30}
              src={userStore.user?.avatar || Avatar}
            ></StyledImage>
          </span>
        }
      </Dropdown> */}
      </>
    )
  },
)
