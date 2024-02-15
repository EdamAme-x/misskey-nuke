const regex = new RegExp(`^[a-zA-Z0-9]+$`); // Misskey token regex

export function isToken(token: string | undefined) {
  if (!token) return false;
  return regex.test(token);
}
