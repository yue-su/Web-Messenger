const sequelize = require("./dbconfig")
const { DataTypes } = require("sequelize")

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    isEmail: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photoURL: { type: DataTypes.STRING, allowNull: true },
})

const Session = sequelize.define("Session", {
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  UserId_to: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
})

const Message = sequelize.define("Message", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  SessionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Session,
      key: "id",
    },
  },
})

User.sync()
  .then(() => {
    console.log("User synced")
    Session.sync()
      .then(() => {
        console.log("sessions synced")
        Message.sync()
          .then(() => {
            console.log("messages synced")
          })
          .catch((err) => console.error(err))
      })
      .catch((err) => console.error(err))
  })
  .catch((err) => console.error(err))

module.exports = { User, Session, Message }
