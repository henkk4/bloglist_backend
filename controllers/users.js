const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (!body.username || !body.password ||
      body.username.length < 3 || body.password.length < 3) {
          return response.status(400).send({ error: 'invalid username or password'})
      }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

      const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
      })
      const savedUser = await user.save()
      response.status(200).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    .populate('blogs', {title: 1, author: 1, url: 1})
    response.json(users.map(u => u.toJSON()))
  })

module.exports = usersRouter