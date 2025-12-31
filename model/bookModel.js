const mongoose = require('mongoose')

const { create } = require('./userModel')
const bookScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, author: {
        type: String,
        required: true
    }
    , pages: {
        type: Number,
        required: true
    }
    , price: {
        type: Number,
        required: true
    }
    , discountPrice: {
        type: Number,
        required: true
    }
    , imgUrl: {
        type: String,
        required: true
    }, languages: {
        type: String,
        required: true
    }, publisher: {
        type: String,
        required: true
    }
    , abstract: {
        type: String,
        required: true
    }
    , isbn: {
        type: String,
        required: true
    }
    , category: {
        type: String,
        required: true
    }
    , uploadImg: {
        type: Array,
        required: true
    }, sellerMail: {
        type: String,
        required: true
    }, status: {
        type: String,
        default: 'pending'
    }, buyerMail: {
        type: String,
        default: ''
    }
})
const books = mongoose.model('books', bookScheme)
module.exports = books