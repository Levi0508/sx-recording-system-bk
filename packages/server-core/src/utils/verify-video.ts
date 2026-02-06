// export async function checkFileExists(url: string) {
//   try {
//     const response = await fetch(url, { method: 'HEAD' });
//     return response.ok; // 如果状态码是 2xx 则返回 true，否则返回 false
//   } catch (error) {
//     return false; // 请求失败则返回 false
//   }
// }
export async function checkFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok; // 状态码 2xx 表示文件存在
  } catch (error) {
    return false; // 请求失败，文件可能不存在
  }
}
