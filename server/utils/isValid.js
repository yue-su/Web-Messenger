//to check the user registration
function isValid(user) {
  return Boolean(
    user.username && user.password && user.email && user.password.length > 6
  );
}

module.exports = { isValid };
