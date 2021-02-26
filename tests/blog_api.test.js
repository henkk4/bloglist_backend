const { expect } = require('@jest/globals')
const expectExport = require('expect')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImluZmx1ZW5zZXIuMiIsImlkIjoiNjAzOGVlMGE1MDcwMTliODI0MTg5YjRlIiwiaWF0IjoxNjE0MzQ4Nzc4fQ.QPcnWCAeoEyDFia7SIhvn0xnon-QzSZ9Xwr2HKzHe4s'

const initialBlogs = [
  {
    title: 'food',
    author: 'mamma',
    url: 'www.food.com',
    likes: 0
  },
  {
    title: 'fashion',
    author: 'influenser',
    url: 'www.fashion.com',
    likes: 3
  },
]
const noLikesBlog = {
    title: 'sport',
    author: 'sportmag',
    url: 'www.sport.com'
}

const noInfoBlog = {
    author: 'sportmaan',
    likes: 3
}

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('right number of blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('id is defined', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
      expect(response.body[0].id).toBeDefined()
})

test('new blog is added', async () => {
    await api
      .post('/api/blogs')
      .send(initialBlogs[0])
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('likes set to 0', async () => {
    const response = await api
      .post('/api/blogs')
      .send(noLikesBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
})

test('bad request if no title or url', async () => {
    await api
      .post('/api/blogs')
      .send(noInfoBlog)
      .set({ Authorization: token })
      .expect(400)
})

test('Unauthorized if no token', async () => {
  await api
    .post('/api/blogs')
    .send(noInfoBlog)
    .expect(401)
})

afterAll(() => {
  mongoose.connection.close()
})