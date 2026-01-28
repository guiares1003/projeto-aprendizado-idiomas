export const hashPassword = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash)}`;
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
