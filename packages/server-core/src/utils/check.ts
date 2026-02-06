export function isGmailEmail(email: string): boolean {
  const gmailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  return gmailRegex.test(email);
}
