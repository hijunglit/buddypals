export const parseError = (err) => {
  if (err.isJoi) return err.details[0];
  return JSON.stringify(err, Object.getOwnPropertyNames(err));
};
export const sessionizeUser = (user) => {
  return {
    userId: user._id,
    username: user.username,
    userIntro: user.intro,
    thumbnailImageUrl: "https://www.gravatar.com/avatar/?d=mp&f=y",
  };
};

export const socialSessionizeUser = (user) => {
  return {
    userId: user._id,
    username: user.username,
    profileImage: user.profileImgUrl,
    thumbnailImage: user.thumbnailImageUrl,
  };
};
