export const getRandomAvatar = () => {
  const index = Math.floor(Math.random() * 7 + 1);
  return `/images/avatar-${index}.png`;
};
