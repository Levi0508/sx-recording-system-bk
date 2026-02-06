export interface IPolicyStatement {
  effect: 'Allow' | 'Deny'
  action: string[]
}

export class PolicyStatement implements IPolicyStatement {
  effect: 'Allow' | 'Deny'
  action: string[]

  constructor(statement: IPolicyStatement) {
    this.effect = statement.effect || 'Allow'
    this.action = statement.action || []
  }

  /**
   * 策略规则匹配，如果匹配成功，则返回true
   * @param action
   * @returns
   */
  matchAction(action: string): boolean {
    const result = this.action.some((_) => this.keyMatch(action, _))
    console.log('PolicyStatement->matchAction', {
      action,
      result,
      effect: this.effect,
    })
    return result
  }

  /**
   * 规则匹配
   *
   * 1.通配符匹配
   *
   * `*` ---> true
   *
   * `*:*:*` ---> true
   *
   * 2.第一段匹配，不允许模糊匹配
   *
   * `*:read:Base` === `demo:read:Base` ---> true
   *
   * `demo:read:Base` === `test:read:Base` ---> false
   *
   * `demo*:read:Base` === `demo123:read:Base` ---> false
   *
   * 3.第二段匹配，不允许模糊匹配
   *
   * `demo:*:Base` === `demo:read:Base` ---> true
   *
   * `demo:read:Base` === `demo:delete:Base` ---> false
   *
   * `demo:read*:Base` === `demo:readAll:Base` ---> false
   *
   * 4.第三段匹配，允许模糊匹配末尾
   *
   * `demo:read:Base123` === `demo:read:Base456` ---> false
   *
   * `demo:read:Base*` === `demo:read:Base456` ---> true
   *
   * `demo:read:Base*` === `demo:read:Base` ---> true
   *
   * `demo:read:*` === `demo:read:Base` ---> true
   *
   * @param action action
   * @param patter 规则表达式
   * @returns
   */
  keyMatch(action: string, patter: string): boolean {
    console.log('PolicyStatement->keyMatch', { action, patter })

    // 如果规则表达式是 *，则直接匹配成功
    if (patter === '*') return true

    const actionParts = action.split(':')
    const patterParts = patter.split(':')

    // 如果规则表达式中的段数多于 action 中的段数，则不匹配
    if (patterParts.length > actionParts.length) return false
    // 如果规则表达式中的段数少于 action 中的段数，则不匹配
    if (actionParts.length !== 3) return false

    // 逐段匹配
    for (let i = 0; i < patterParts.length; i++) {
      const part1 = actionParts[i]
      const part2 = patterParts[i]

      // 如果规则表达式中的当前段是 *，则匹配成功，继续下一段匹配
      if (part2 === '*') continue

      // 如果规则表达式中的当前段不等于 action 中的当前段，则不匹配
      if (part1 !== part2) {
        // 第三段匹配，允许模糊匹配末尾
        if (i === 2 && part2.endsWith('*')) {
          const prefix = part2.slice(0, -1)
          if (part1.startsWith(prefix)) continue
        }
        return false
      }
    }

    // 如果全部段匹配成功，则匹配成功
    return true
  }
}
