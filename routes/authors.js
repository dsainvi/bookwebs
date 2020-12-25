const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
//const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Authors Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Author Route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() })
})

// Create Author Route
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name,
    about: req.body.about
  })
  //saveauthor(author, req.body.author)

  try {
    const newAuthor = await author.save()
    res.redirect(`authors/${newAuthor.id}`)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Author'
    })
  }
})

router.get('/:id', async (req,res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req,res) => {
  try{
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', { author: author })
  } catch {
    res.redirect('/authors')
  }
})

router.put('/:id', async (req,res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    author.about = req.body.about
    // if(req.body.author != null && req.body.author !== '') {
    //   saveauthor(book, req.body.author)
    // }
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    }
  }
})


router.delete('/:id', async (req,res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
})

// function saveauthor(author, authorEncoded) {
//   if (authorEncoded == null) return 
//   const author = JSON.parse(authorEncoded)
//   if (author != null && imageMimeTypes.includes(author.type)) {
//     author.authorImage = new Buffer.from(author.data, 'base64')
//     author.authorImageType = author.type
//   }
// }

module.exports = router