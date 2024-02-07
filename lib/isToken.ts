const length = 32; // Misskey token length
const regex = new RegExp(`^[a-zA-Z0-9]{${length}}$`); // Misskey token regex

export function isToken(token: string | undefined) {
  if (!token) return false;
  return regex.test(token);
}
