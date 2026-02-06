import { useIsMobile } from '~/hooks/useIsMobile'
import styled from '@emotion/styled'

const StyledPage = styled.div`
  overflow-y: scroll;

  @media (max-width: 768px) {
    /* width: 120px; */
    overflow-y: visible;
    height: 100%;
  }
`
const StyledTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  @media (max-width: 768px) {
    padding-top: 10px;
  }
`
const StyledTop = styled.div`
  margin: 20px;
  @media (max-width: 768px) {
    margin: 0px;
  }
`
const StyledSpan = styled.span`
  color: #ea7a99;
  margin: 0 3px;
  cursor: pointer;
`
const StyledInfo = styled.div`
  margin: 10px 0 10px 30px;
  font-size: 18px;
  div {
    font-size: 15px;
    margin-top: 10px;
    letter-spacing: 1px;
  }
  span {
    color: #ea7a99;
    margin: 0 3px;
  }
  li {
    margin-top: 10px;
  }
`

export const ServicePart = () => {
  const isMobile = useIsMobile()

  return (
    <StyledPage
      style={{ height: isMobile ? '100%' : window.innerHeight - 100 }}
    >
      <StyledTop>
        <StyledTitle>客服联系方式</StyledTitle>
        <StyledInfo>
          <ul>
            <li>
              QQ：<span>3768637494</span>
            </li>
            <li>
              邮箱：<span>1946742459@qq.com</span>
            </li>
            <li style={{ fontSize: 15 }}>
              有任何疑问或者对网站的建议，都可以联系客服😊
            </li>
          </ul>
        </StyledInfo>
      </StyledTop>

      <StyledTop>
        <StyledTitle>常见问题</StyledTitle>
        <StyledInfo>
          <ul>
            <li style={{ fontWeight: 500 }}>VIP怎样充值？</li>
            <div>
              <div>
                1️⃣ 在<span>会员中心</span>或<span>会员商城</span>
                页面中点击
                <StyledSpan
                  onClick={() => {
                    window.open('https://shop.autofaka.com//links/4C7BA277')
                  }}
                >
                  充值
                </StyledSpan>
                按钮，将会跳转到发卡平台， 请根据 <span>商品分类</span>
                选择对应金额的商品进行购买。
              </div>
              <div>
                2️⃣ 支付完成后将获得一串10位的兑换码（如：
                <span>asx2sfkj8u</span>
                ），长按复制兑换码
              </div>
              <div>
                3️⃣ 将之粘贴到会员中心/会员商城的
                <span>自助兑换卡密</span>
                区进行兑换，成功会您的账户余额将会增加相应平台货币
              </div>
              <div>
                4️⃣ 平台目前只支持<span>支付宝</span>
                支付，如需<span>微信，paypal</span>等其他方式支付请联系客服
              </div>
            </div>
            <li style={{ fontWeight: 500 }}>
              我的账号可以共享给其他人使用吗？
            </li>
            <div>
              <div>当一个账号出现异常的多设备ip登录，将会被视为共享账号</div>
              <div>
                该账号将会被<span>封号</span>处理，且不退款。
              </div>
            </div>
            <li style={{ fontWeight: 500 }}>可以下载视频吗？</li>
            <div>
              <div>
                不可以。如若被系统检测到异常流量，即视为违规下载视频行为
              </div>
              <div>
                该账号将会被<span>封号</span>处理，且不退款。
              </div>
            </div>
          </ul>
        </StyledInfo>
      </StyledTop>
    </StyledPage>
  )
}
