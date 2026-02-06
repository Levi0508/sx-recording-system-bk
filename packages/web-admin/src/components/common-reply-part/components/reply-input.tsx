import React from 'react'
import styled from '@emotion/styled'
import { Button, Input } from 'antd'
import { useIsMobile } from '~/hooks'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import CommonAvatarFrame from '~/components/common-avatar-frame'

const StyledFlex = styled.div`
  margin: 0 0 10px 10px;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    margin: 0 0 10px 5px;
  }
`
const StyledReply = styled.div`
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  input {
    height: 48px;
    margin: 15px 0 0 10px;
  }
  @media (max-width: 768px) {
    margin-left: 0px;
    input {
      margin-right: 10px;
      height: 38px;
    }
  }
`
const StyledSubmit = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`
const StyledSubmitButton = styled(Button)`
  width: 80px;
  margin-right: 10px;
  display: ${({ show }: { show: boolean }) => (show ? 'block' : 'none')};
`

interface IProps {
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  isFocused: boolean
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
  handleSubmit: () => void
  loading: boolean
}

export const ReplyInput: React.FC<IProps> = ({
  inputValue,
  setInputValue,
  isFocused,
  setIsFocused,
  handleSubmit,
  loading,
}) => {
  const isMobile = useIsMobile()
  const userStore = useStore(UserStore)
  const handleFocus = () => {
    setIsFocused(true)
  }
  // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter') {
  //     handleSubmit()
  //   }
  // }

  return (
    <StyledFlex>
      <StyledReply>
        {/* <CommonAvatar avatar={userStore.user?.avatar} size={50}></CommonAvatar> */}
        <span style={{ margin: isMobile ? '12px 0 0 0' : '12px 12px 0 0' }}>
          <CommonAvatarFrame
            avatar={userStore.user?.avatar}
            selectedFrame={userStore.user?.avatarFrame}
            useAntdImage={false}
            size={isMobile ? 40 : 45}
          ></CommonAvatarFrame>
          {/* {isMobile
            ? AvatarCpn(userStore.user?.avatar, 40)
            : AvatarCpn(userStore.user?.avatar, 45)} */}
        </span>
        <Input
          value={inputValue}
          placeholder="风里雨里，评论区等你"
          onFocus={handleFocus}
          onChange={(e) => setInputValue(e.target.value)}
        ></Input>
      </StyledReply>
      <StyledSubmit style={{ textAlign: 'right' }}>
        {(inputValue || isFocused) && (
          <StyledSubmitButton
            show={isFocused}
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            style={{ backgroundColor: '#FB7299', color: '#fff' }}
          >
            发布
          </StyledSubmitButton>
        )}
      </StyledSubmit>
    </StyledFlex>
  )
}
