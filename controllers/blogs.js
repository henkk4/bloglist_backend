const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    .populate('user', {username: 1, name: 1})

    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const body = request.body
    if (!body.url || !body.title) {
        return response.status(400).json({ error: 'title or url missing' })
    }

    const user = await User.findById(decodedToken.id)
    let blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  })

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        response.status(204).end()
    }
    else if ( blog.user.toString() === user._id.toString() ) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
    else {
        response.status(400).json({ error: 'wrong user' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
     const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

  module.exports = blogsRouter