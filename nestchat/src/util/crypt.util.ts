import * as bcrypt from 'bcrypt';

export const hash = (plainText: string): string => {
  const saltOrRounds = 10;
  return bcrypt.hashSync(plainText, saltOrRounds);
};

export const isHashValid = (pwd, hashPwd): boolean => {
  return bcrypt.compareSync(pwd, hashPwd);
};
