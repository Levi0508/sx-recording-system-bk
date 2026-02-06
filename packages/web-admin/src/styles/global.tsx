import { injectGlobal } from '@emotion/css'
import 'antd/dist/reset.css'

injectGlobal`
* {
  margin: 0;
  padding: 0;
}



html,
body,
#root {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background-color: #fff;
}
`
