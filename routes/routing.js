const express = require('express')
const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const jwtMiddleware = require('../middleware/jwtMiddleware')
const multerMiddleware = require('../middleware/multerMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
// create router object

const router = new express.Router()

// define path for client api request
// register
router.post('/register', userController.registerController)

// login
router.post('/login', userController.loginController)
//google login
router.post('/google/sign-in', userController.googleController)


// get home books
router.get('/books/home', bookController.getHomePageBookController)

// authorised user
// add book form data
router.post('/user/book/add', jwtMiddleware, multerMiddleware.array('uploadImg', 3), bookController.addBookController)


// get all books page
router.get('/books/all', jwtMiddleware, bookController.getUserAllPageBookController)

// get all user upload books page
router.get('/user-books/all', jwtMiddleware, bookController.getUserUploadBookProfilePageController)


// get all user bought books page
router.get('/user-books/bought', jwtMiddleware, bookController.getUserBoughtBookProfilePageController)


//  view book
router.get('/books/:id/view', jwtMiddleware, bookController.viewBookController)

router.put('/user/:id/edit', jwtMiddleware, multerMiddleware.single('pictures'), userController.updateUserProfileController)
// delete book
router.delete('/books/:id', jwtMiddleware, bookController.deleteBookController)

// make payment
router.put('/books/:id/buy', jwtMiddleware, bookController.bookPaymentController)



// authorised admin

router.get('/admin-books/all', adminMiddleware, bookController.getAllBooksController)


// get all users
router.get('/users/all', adminMiddleware, userController.getAllUsersController)


// get all users
router.put('/books/:id/update', adminMiddleware, bookController.updateBookStatusController)
module.exports = router