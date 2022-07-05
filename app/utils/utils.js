isAdminOrModerator = function (role) {
  if (role == "ADMIN" || role == "MODERATOR") {
    return true;
  }
  return false;
};

isAdmin = function (role) {
  if (role == "ADMIN") {
    return true;
  }
  return false;
}

isModerator = function (role) {
  if (role == "MODERATOR") {
    return true;
  }
  return false;
}

module.exports = {
  isAdminOrModerator,
  isAdmin,
  isModerator,
}
