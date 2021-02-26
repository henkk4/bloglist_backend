const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let totalLikes = 0
    if (blogs.length > 0) {
        totalLikes = blogs.reduce((sum, item) => {
            return sum + item.likes
        }, 0)
    }
    return totalLikes
}

const favouriteBlog = (blogs) => {
    let favouriteBlog = 0
    let likes = blogs.map(blog => blog.likes)

    let maxLikes = Math.max(...likes)

    favouriteBlog = blogs.find(blog => blog.likes === maxLikes)
    
    return favouriteBlog
}

const mostBlogs = (blogs) => {
    let authors = blogs.map(blog => blog.author)
    let bloggers = []

    for (let i = 0; i < authors.length; ++i) {
        if (!bloggers.find(blogger => blogger.author === authors[i])) {
            let blogger = {
                author: authors[i],
                blogs: 0
            }
            bloggers.push(blogger)
        }
        for (let j = 0; j < bloggers.length; ++j) {
            if (bloggers[j].author === authors[i]) {
                ++bloggers[j].blogs 
            }
        }
    }
    let numbersOfBlogs = bloggers.map(blogger => blogger.blogs)
    let maxBlogs = Math.max(...numbersOfBlogs)
    let mostBlogs = bloggers.find(blogger => blogger.blogs === maxBlogs)

    return mostBlogs
}

const mostLikes = (blogs) => {
    let authors = blogs.map(blog => blog.author)
    let likes = blogs.map(blog => blog.likes)
    let bloggers = []


    for (let i = 0; i < authors.length; ++i) {
        if (!bloggers.find(blogger => blogger.author === authors[i])) {
            let blogger = {
                author: authors[i],
                likes: 0
            }
            
            bloggers.push(blogger)
        }
        for (let j = 0; j < bloggers.length; ++j) {
            if (bloggers[j].author === authors[i]) {
                bloggers[j].likes = bloggers[j].likes + likes[i]
            }
        }
    }
    let numbersOfLikes = bloggers.map(blogger => blogger.likes)
    let maxLikes = Math.max(...numbersOfLikes)
    let mostLikes = bloggers.find(blogger => blogger.likes === maxLikes)

    return mostLikes
}




module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}