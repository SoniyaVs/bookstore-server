const books = require('../model/bookModel')

exports.addBookController = async (req, res) => {
    console.log('Inside Book Controller');
    console.log(req.body);
    // get book details from req body && and upload img from req files and seller mail from req payload
    const { title, author, pages, price, discountPrice, imgUrl, languages, publisher, abstract, isbn, category } = req.body
    // console.log(title, author, pages, price, discountPrice, imgUrl, languages, publisher, abstract, isbn, category, uploadImg);
    const uploadImg = req.files.map(item => item.filename)
    const sellerMail = req.payload
    console.log(title, author, pages, price, discountPrice, imgUrl, languages, publisher, abstract, isbn, category, uploadImg, sellerMail);


    try {
        const existingUser = await books.findOne({ title, sellerMail })
        if (existingUser) {
            res.status(401).json("Uploaded book already exist!!! Request failed!!!")

        } else {
            const newBook = await books.create({ title, author, pages, price, discountPrice, imgUrl, languages, publisher, abstract, isbn, category, uploadImg, sellerMail })
            res.status(200).json(newBook)

        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)


    }
    // res.status(200).json("Add book request received")
}
// get home books
exports.getHomePageBookController = async (req, res) => {
    console.log('Inside get HomePage BookController');
    try {
        // get newly added 4 books from db
        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
    // res.status(200).json("Add book request received")
}

// get all books -user

exports.getUserAllPageBookController = async (req, res) => {
    console.log('Inside get User All Page Book Controller');
    //get login user mail from token
    const searchKey = req.query.search
    console.log(searchKey);

    const loginUserMail = req.payload
    try {
        // get all books from db expect loggedin user
        const allBooks = await books.find({ sellerMail: { $ne: loginUserMail }, title: { $regex: searchKey, $options: 'i' } })
        res.status(200).json(allBooks)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
    // res.status(200).json("Add book request received")
}
// get all user  uploaded books
exports.getUserUploadBookProfilePageController = async (req, res) => {
    console.log('Inside get UserProfile Page Book Controller');
    //get login user mail from token
    const loginUserMail = req.payload
    try {
        // get all books from db expect loggedin user
        const allUserBooks = await books.find({ sellerMail: loginUserMail })
        res.status(200).json(allUserBooks)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
    // res.status(200).json("Add book request received")
}

// get all user  bought books
exports.getUserBoughtBookProfilePageController = async (req, res) => {
    console.log('Inside get User Bought Book Profile Page Controller');
    //get login user mail from token
    const loginUserMail = req.payload
    try {
        // get all books from db expect loggedin user
        const allUserPurchaseBooks = await books.find({ buyerMail: loginUserMail })
        res.status(200).json(allUserPurchaseBooks)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
    // res.status(200).json("Add book request received")
}


exports.viewBookController = async (req, res) => {
    console.log("Inside viewBookController");

    const { id } = req.params
    try {
        const bookDetails = await books.findById({ _id: id })
        res.status(200).json(bookDetails)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)

    }
}
// get all book-admin
exports.getAllBooksController = async (req, res) => {
    console.log("Inside get all Book Controller");
    try {
        // get all book from db
        const allBooks = await books.find()
        res.status(200).json(allBooks)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)

    }
}

// update book status admin -login user
exports.updateBookStatusController = async (req, res) => {
    console.log("Inside update Book Status Controller");
    // get id from book
    const { id } = req.params
    try {
        // get  book details from db
        const bookDetails = await books.findById({ _id: id })
        bookDetails.status = "approved"
        // save changes to mongodb
        await bookDetails.save()
        res.status(200).json(bookDetails)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)

    }
}

exports.deleteBookController = async (req, res) => {
    console.log("Inside delete Book Controller");
    // get id from book
    const { id } = req.params
    try {
        // get  book details from db
        const bookDetails = await books.findByIdAndDelete({ _id: id })
        res.status(200).json(bookDetails)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)

    }
}

// payment

exports.bookPaymentController = async (req, res) => {
    console.log("inside buyBookPaymentController ");
    const stripe = require('stripe')(process.env.STRIPESECRET);
    // const { title, author, pages, price, discountPrice, imgUrl, languages, publisher, abstract, isbn, category, _id, uploadImg, sellerMail } = req.body
    const email = req.payload
    const { id } = req.params
    try {
        const bookDetails = await books.findById({ _id: id })
        bookDetails.status="sold"
        bookDetails.buyerMail=email
        await bookDetails.save()
        const { title, author, pages, price, discountPrice, imgUrl, languages, publisher, abstract, isbn, category, _id, uploadImg, sellerMail }=bookDetails
        // checkout session
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: title,
                    description: `${author}|${publisher}`,
                    images: uploadImg,
                    metadata: {
                        title, author, pages, price, discountPrice, imgUrl
                    }
                },
                unit_amount: Math.round(discountPrice * 100)
            },
            quantity: 1

        }]

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: 'http://localhost:5173/user/payment-success',
            cancel_url: 'http://localhost:5173/user/payment-error',
            payment_method_types: ["card"]


        });
        console.log(session);
        res.status(200).json({checkoutURL:session.url})


    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}