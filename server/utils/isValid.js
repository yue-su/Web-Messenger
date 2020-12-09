function isValid(user) {
  return Boolean(
    user.username &&
      user.password &&
      user.email &&
      typeof user.password === "string"
  );
}

module.exports = { isValid };
