import { HttpRequestConfig } from '@af-charizard/sdk-utils'
import { request } from './helpers'

import { comment$create } from './services/comment$create'
import { comment$delete } from './services/comment$delete'
import { comment$find$videoId } from './services/comment$find$videoId'
import { comment$like$add } from './services/comment$like$add'
import { comment$like$remove } from './services/comment$like$remove'
import { comment$reply } from './services/comment$reply'
import { comment$top$add } from './services/comment$top$add'
import { comment$top$remove } from './services/comment$top$remove'
import { email$sendCode$register } from './services/email$sendCode$register'
import { email$sendCode$resetPassword } from './services/email$sendCode$resetPassword'
import { notification$create } from './services/notification$create'
import { notification$createSystemNotification } from './services/notification$createSystemNotification'
import { notification$read$all } from './services/notification$read$all'
import { notification$read } from './services/notification$read'
import { notification$receive$read } from './services/notification$receive$read'
import { notification$receive$type } from './services/notification$receive$type'
import { notification$receive$unread } from './services/notification$receive$unread'
import { oauth2$google$authorize } from './services/oauth2$google$authorize'
import { oauth2$google$redirect } from './services/oauth2$google$redirect'
import { passport$create } from './services/passport$create'
import { passport$get$daily_data } from './services/passport$get$daily_data'
import { passport$update$visit_count } from './services/passport$update$visit_count'
import { pay$echarts$list } from './services/pay$echarts$list '
import { pay$exchange$card } from './services/pay$exchange$card'
import { pay$exchange_card$create } from './services/pay$exchange_card$create'
import { pay$exchange_card$no_use_by_type } from './services/pay$exchange_card$no_use_by_type'
import { pay$find$invitation$record } from './services/pay$find$invitation$record'
import { pay$find$invitationCode } from './services/pay$find$invitationCode'
import { pay$list } from './services/pay$list'
import { pay$update$invitationCode } from './services/pay$update$invitationCode'
import { permission$policy$create } from './services/permission$policy$create'
import { permission$policy$delete } from './services/permission$policy$delete'
import { permission$policy$list } from './services/permission$policy$list'
import { permission$policy$update } from './services/permission$policy$update'
import { permission$role$create } from './services/permission$role$create'
import { permission$role$delete } from './services/permission$role$delete'
import { permission$role$list } from './services/permission$role$list'
import { permission$role$update } from './services/permission$role$update'
import { signIn$checkin } from './services/signIn$checkin'
import { signIn$checkinInfo } from './services/signIn$checkinInfo'
import { signIn$echarts$list } from './services/signIn$echarts$list'
import { signIn$getGift } from './services/signIn$getGift'
import { signIn$handle } from './services/signIn$handle'
import { user$addVip$forUser } from './services/user$addVip$forUser'
import { user$addVip$forVip } from './services/user$addVip$forVip'
import { user$avatar$userId } from './services/user$avatar$userId'
import { user$avatar_frames } from './services/user$avatar_frames'
import { user$ban$account } from './services/user$ban$account'
import { user$ban$ip } from './services/user$ban$ip'
import { user$buy$anchor } from './services/user$buy$anchor'
import { user$buy$anchorUpdatePackage } from './services/user$buy$anchorUpdatePackage'
import { user$buy$avatar_frame } from './services/user$buy$avatar_frame'
import { user$buy$month } from './services/user$buy$month'
import { user$buy$order } from './services/user$buy$order'
import { user$buy$vip } from './services/user$buy$vip'
import { user$convert$vip } from './services/user$convert$vip'
import { user$deblocking$account } from './services/user$deblocking$account'
import { user$exchange$query } from './services/user$exchange$query'
import { user$find$userId } from './services/user$find$userId'
import { user$get$anchorGoodsPurchaseInfo } from './services/user$get$anchorGoodsPurchaseInfo'
import { user$get$hotAnchors } from './services/user$get$hotAnchors'
import { user$get$newAnchors } from './services/user$get$newAnchors'
import { user$list } from './services/user$list'
import { user$login$username } from './services/user$login$username'
import { user$logout } from './services/user$logout'
import { user$pay } from './services/user$pay'
import { user$record$anchorGoodsClick } from './services/user$record$anchorGoodsClick'
import { user$register$info } from './services/user$register$info'
import { user$register$username } from './services/user$register$username'
import { user$reset$password } from './services/user$reset$password'
import { user$unban$ip } from './services/user$unban$ip'
import { user$upload$avatar } from './services/user$upload$avatar'
import { user$vip$top } from './services/user$vip$top'
import { user$wear_avatar_frame } from './services/user$wear_avatar_frame'
import { video$add$favorite } from './services/video$add$favorite'
import { video$add$history } from './services/video$add$history'
import { video$add$like } from './services/video$add$like'
import { video$add$unlike } from './services/video$add$unlike'
import { video$classification$one } from './services/video$classification$one'
import { video$classification } from './services/video$classification'
import { video$clear$favorite } from './services/video$clear$favorite'
import { video$clear$history } from './services/video$clear$history'
import { video$favorite$classifications } from './services/video$favorite$classifications'
import { video$findAll } from './services/video$findAll'
import { video$findOneById } from './services/video$findOneById'
import { video$home } from './services/video$home'
import { video$more$classification } from './services/video$more$classification'
import { video$play } from './services/video$play'
import { video$random$classification } from './services/video$random$classification'
import { video$random } from './services/video$random'
import { video$remove$favorite } from './services/video$remove$favorite'
import { video$search$favorite } from './services/video$search$favorite'
import { video$search$history } from './services/video$search$history'
import { video$search$title } from './services/video$search$title'
import { video$videoUrl$default } from './services/video$videoUrl$default'
import { video$videoUrl$vip } from './services/video$videoUrl$vip'

export const services = {
  use: (config?: HttpRequestConfig) => {
    request.instance = request.create(config)
  },
  comment$create,
  comment$delete,
  comment$find$videoId,
  comment$like$add,
  comment$like$remove,
  comment$reply,
  comment$top$add,
  comment$top$remove,
  email$sendCode$register,
  email$sendCode$resetPassword,
  notification$create,
  notification$createSystemNotification,
  notification$read$all,
  notification$read,
  notification$receive$read,
  notification$receive$type,
  notification$receive$unread,
  oauth2$google$authorize,
  oauth2$google$redirect,
  passport$create,
  passport$get$daily_data,
  passport$update$visit_count,
  pay$echarts$list,
  pay$exchange$card,
  pay$exchange_card$create,
  pay$exchange_card$no_use_by_type,
  pay$find$invitation$record,
  pay$find$invitationCode,
  pay$list,
  pay$update$invitationCode,
  permission$policy$create,
  permission$policy$delete,
  permission$policy$list,
  permission$policy$update,
  permission$role$create,
  permission$role$delete,
  permission$role$list,
  permission$role$update,
  signIn$checkin,
  signIn$checkinInfo,
  signIn$echarts$list,
  signIn$getGift,
  signIn$handle,
  user$addVip$forUser,
  user$addVip$forVip,
  user$avatar$userId,
  user$avatar_frames,
  user$ban$account,
  user$ban$ip,
  user$buy$anchor,
  user$buy$anchorUpdatePackage,
  user$buy$avatar_frame,
  user$buy$month,
  user$buy$order,
  user$buy$vip,
  user$convert$vip,
  user$deblocking$account,
  user$exchange$query,
  user$find$userId,
  user$get$anchorGoodsPurchaseInfo,
  user$get$hotAnchors,
  user$get$newAnchors,
  user$list,
  user$login$username,
  user$logout,
  user$pay,
  user$record$anchorGoodsClick,
  user$register$info,
  user$register$username,
  user$reset$password,
  user$unban$ip,
  user$upload$avatar,
  user$vip$top,
  user$wear_avatar_frame,
  video$add$favorite,
  video$add$history,
  video$add$like,
  video$add$unlike,
  video$classification$one,
  video$classification,
  video$clear$favorite,
  video$clear$history,
  video$favorite$classifications,
  video$findAll,
  video$findOneById,
  video$home,
  video$more$classification,
  video$play,
  video$random$classification,
  video$random,
  video$remove$favorite,
  video$search$favorite,
  video$search$history,
  video$search$title,
  video$videoUrl$default,
  video$videoUrl$vip,
}
