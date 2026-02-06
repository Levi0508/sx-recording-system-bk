import { SearchOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from 'antd'
import { useLocation, useNavigate } from 'react-router'
import { SearchProps } from 'antd/es/input'

const { Search } = Input

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`

const StyledSearchContainer = styled.div<{ expanded: boolean }>`
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  width: ${({ expanded }) => (expanded ? '400px' : '0')};
  overflow: hidden;
  @media (max-width: 768px) {
    width: ${({ expanded }) => (expanded ? '230px' : '0')};
  }
  .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
    height: 36px;
    border-radius: 20px 0 0 20px !important;
  }
  .ant-input-search-button {
    height: 36px;
    border-radius: 0 18px 18px 0 !important;
    border: 1px solid #d9d9d9;
    box-shadow: none !important;
    margin-left: 0px;
  }
  .ant-btn-primary {
    background-color: #fff !important;
    line-height: 40px;
  }
  .ant-input-affix-wrapper-focused {
    border-color: #d9d9d9 !important;
    box-shadow: none !important;
  }
  .ant-input-affix-wrapper:hover {
    border-color: #d9d9d9 !important;
  }
`

const StyledInput = styled(Search)`
  width: 100%;
  transition: all 0.3s ease;

  input:focus {
    box-shadow: none !important; // 去除聚焦时的阴影效果
    border-color: #d9d9d9 !important; // 设置聚焦时的边框颜色，根据需要调整
  }
`

interface IProps {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}
const SearchComponent: React.FC<IProps> = ({ expanded, setExpanded }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchValue, setSearchValue] = useState('')

  const inputRef = useRef<any>(null)

  const handleSearchIconClick = () => {
    setExpanded(!expanded)
  }

  const onSearch: SearchProps['onSearch'] = (value) => {
    if (value) {
      navigate(`/search/title`, { state: { value } })
    } else {
      // navigate(`/`)
      setExpanded(false)
      // setSearchValue('')
    }
  }

  useEffect(() => {
    // 路由变化时清空搜索输入框的值
    setSearchValue('')
  }, [location])

  const handleBlur = () => {
    if (!searchValue) {
      setExpanded(false)
    }
  }

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus() // Focus the input element
    }
  }, [expanded])
  return (
    <StyledDiv>
      {!expanded && (
        <SearchOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={handleSearchIconClick}
        />
      )}
      <StyledSearchContainer expanded={expanded}>
        <StyledInput
          ref={inputRef}
          placeholder={'请输入关键词搜索'}
          onSearch={onSearch}
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus={expanded}
          enterButton={
            <SearchOutlined style={{ color: '#1f1f1f', fontSize: 20 }} />
          }
          style={{ borderRadius: '18px' }}
        />
      </StyledSearchContainer>
    </StyledDiv>
  )
}

export default SearchComponent
