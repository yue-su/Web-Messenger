function syncModels(sequelize) {
  const { user, conversation, message } = sequelize.models;

  user
    .sync()
    .then(() => {
      console.log("user synced");
      conversation
        .sync()
        .then(() => {
          console.log("conversation synced");
          message
            .sync()
            .then(() => {
              console.log("message synced");
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
}

module.exports = { syncModels };
