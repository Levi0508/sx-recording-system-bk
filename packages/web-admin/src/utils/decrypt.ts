import CryptoJS from 'crypto-js'

// 与后端一致的密钥
const secretKey =
  '2b7e151628aed2a6abf7158809cf4f3c2b7e151628aed2a6abf7158809cf4f3c'

// 解密函数
export function decryptResource(encryptedData: any) {
  // 如果 encryptedData 不是字符串，或者不包含 ':'，说明不是加密数据，直接返回
  if (typeof encryptedData !== 'string' || !encryptedData.includes(':')) {
    return encryptedData
  }

  try {
  // 解析 IV 和加密数据
  const [ivHex, encryptedTextHex] = encryptedData.split(':')
    
    // 如果分割后不是两个部分，说明格式不对，直接返回原值
    if (!ivHex || !encryptedTextHex) {
      return encryptedData
    }

  const iv = CryptoJS.enc.Hex.parse(ivHex)
  const encryptedText = CryptoJS.enc.Hex.parse(encryptedTextHex)
  const key = CryptoJS.enc.Hex.parse(secretKey)

  // 解密数据
  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: encryptedText,
    } as any,
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    },
  )

  // 将解密数据转换为 UTF-8 字符串并解析为 JSON
  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decryptedText)
  } catch (error) {
    // 解密失败，返回原值（可能是未加密的数据）
    console.debug('解密失败，返回原值:', error)
    return encryptedData
  }
}
