import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtpdm.aliyun.com',
  port: 465,
  secure: true, // 使用 SSL
  auth: {
    user: 'noreply@mail.af-charizard.com',
    pass: 'ChenLiFeng0508',
  },
  connectionTimeout: 60000, // 60秒超时
  socketTimeout: 60000,
});

export async function sendMail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: '<noreply@mail.af-charizard.com>',
    to: to,
    subject: subject,
    text: text,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('邮件发送成功:', info.messageId);
    return info;
  } catch (error) {
    console.error('发送邮件时发生错误:', error);
    throw error;
  }
}
