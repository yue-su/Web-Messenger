const userSocketIdMap = new Map();

function addUserToMap(userId, socketId) {
  if (!userSocketIdMap.has(userId)) {
    userSocketIdMap.set(userId, socketId);
  }
}

function removeUserFromMap(userId) {
  if (userId) {
    userSocketIdMap.delete(userId);
  }
}

module.exports = {
  userSocketIdMap,
  addUserToMap,
  removeUserFromMap,
};
