import dayjs from 'dayjs'

/**
 * 检查会员状态
 * @param vipDeadLine 会员截止日期
 * @returns {status: string, isVip: boolean}
 * - status: 'expired' 表示会员已过期, 'valid' 表示会员有效, 'noVip' 表示没有注册会员
 * - isVip: true 表示会员有效, false 表示会员已过期或没有注册会员
 */
export function checkMembershipStatus(vipDeadLine?: string | null) {
  if (!vipDeadLine) {
    return { status: 'noVip', isVip: false }
  }

  const isVip = dayjs(vipDeadLine).isAfter(dayjs())
  return {
    status: isVip ? 'valid' : 'expired',
    isVip,
  }
}
