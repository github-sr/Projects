// ============================================ Importing module for defining paths ============================================
const path = require('path')

// ============================================ Importing express modules ============================================
const express = require('express')
const expressEdge = require('express-edge')
const app = new express()

// ============================================ Importing module to parse forms ============================================
const bodyParser = require('body-parser')

// ============================================ Importing module for database ============================================
const mongoose = require('mongoose')
// const post = require('./database/models/post')
mongoose.connect('mongodb://localhost/node-js-blog', { useNewUrlParser: true })

// ============================================ Importing module for image upload ============================================
const fileUpload = require('express-fileupload')

// ============================================ Importing module for user session ============================================
const expressSession = require('express-session')

// ============================================ Importing module for user session ============================================
const connectMongo = require('connect-mongo')

// ============================================ Importing module for user session ============================================
const connectFlash = require('connect-flash')

// ============================================ Importing Controllers ============================================
const homePageController = require('./controllers/homePage')

const createPostController = require('./controllers/createPost')
const getPostController = require('./controllers/getPost')
const storePostController = require('./controllers/storePost')

const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')

const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')

// ============================================ Using Middleware ============================================
app.use(fileUpload())

// Storing session in database
const mongoStore = connectMongo(expressSession)
app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}))

app.use(connectFlash())

app.use(express.static('public'))
//app.use(express.static(path.join(__dirname,'public')))

app.use(expressEdge)

// For post request - body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// ================ Defining my own middleware ================
const customMiddleware = (req, res, next) => {
    // console.log("customMiddleware is called");
    next();
}

// Using my middleware for all requests
app.use(customMiddleware)

const storePostMiddleware = require('./middleware/storePost')

// See similar way in post request below
// Using my middleware only for request to '/posts/store'
// app.use('/posts/store', storePostMiddleware);


const authMiddleware = require('./middleware/auth')

// See similar way in get request below
// app.use('/posts/new', authMiddleware)

// ============================================ Setting views directory ============================================
app.set('views',`${__dirname}/views`)


// ============================================ Creating actions for requests ============================================
app.get('/', homePageController)


app.get('/posts/new', authMiddleware, createPostController)

app.post('/posts/store', authMiddleware, storePostMiddleware, storePostController)

app.get('/post/:id', getPostController)


app.get('/auth/register', createUserController)

app.post('/users/register', storeUserController)


app.get('/auth/login', loginController)

app.post('/users/login', loginUserController)

// ============================================ Running application at port 4000 ============================================
// http://localhost:4000/
app.listen(4000, () => {
    console.log('App listening on port 4000');
})

