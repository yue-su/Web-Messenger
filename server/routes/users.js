const db = require("../models/dbconfig")
const { User, Session, Message } = require("../models/models")
const router = require("express").Router()

router.post("/register", (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(201).json({ data: user })
    })
    .catch((error) => res.status(500).json({ message: error.message }))
})

module.exports = router
