export const parsError = (err) => {
  if (err.isJoi) return err.details[0];
  return JSON.stringify(err, Object.getOwnPropertyNames(err));
};

export const sessionizeUser = (user) => {
  return { userId: user._id, username: user.username };
};
