function addAssociations(sequelize) {
  const { user, conversation, message } = sequelize.models;

  user.hasMany(conversation);
  conversation.belongsTo(user);

  conversation.hasMany(message);
  message.belongsTo(conversation);

  user.hasMany(message);
  message.belongsTo(user);
}

module.exports = { addAssociations };
