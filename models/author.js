const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  createrImage: {
    type: Buffer,
    required: true
  },
  createrImageType: {
    type: String,
    required: true
  }
})

authorSchema.virtual('createrImagePath').get(function() {
  if (this.createrImage != null && this.createrImageType != null) {
    return `data:${this.createrImageType};charset=utf-8;base64,${this.createrImage.toString('base64')}`
  }
})

authorSchema.pre('remove', function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err)
    } else if (books.length > 0) {
      next(new Error('This author has books still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Author', authorSchema)