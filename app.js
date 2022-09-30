const express = require('express');
const app = express();
const helmet = require("helmet");
app.use(helmet());
const { ApolloServer } = require("apollo-server");
require('dotenv').config()

const session = require("express-session");    // Web ' de session ' da bilgiyi tutmak
const MongoDbStore = require("connect-mongodb-session")(session);  // to transform session info to mongoDB
const bodyParser = require("body-parser");
const path = require('path');
const multer = require('multer');

// Middlewares and Schemas
const errorController = require("./controllers/errorController");
const locals = require("./middlewares/locals");
const isAdmin = require("./middlewares/isAdmin");
const User = require("./models/User");
const Apikey = require("./models/Apikey");

const { typeDefs } = require("./GraphQL/type-defs");
const { resolvers } = require("./GraphQL/resolvers");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
        return {
            isAuthenticated: async () => {
                const apiKey = req.headers.apikey;
                let bool = false;
                await Apikey.findOne({ key: apiKey }).then(key => {
                    if (key) {
                        bool = true;
                    }
                }).catch(e => console.log(e));
                return bool;
            }
        }
    }
});

const connectionString = process.env.CONNECTION_STRING;
// routers
const userRouter = require("./routers/user")
const adminRouter = require("./routers/admin");
const accountRouter = require("./routers/account");
const { default: mongoose } = require('mongoose');

app.set("view engine", "pug");
app.set("views", "./views");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/img/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

var store = new MongoDbStore({
    uri: connectionString,
    collection: "mySessions"
});

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    },
    store: store
}));

// User Controller if there is any!
app.use((req, res, next) => {

    if (!req.session.user) {
        req.session.isAuthenticated = false;
        req.session.isAdmin = false;
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            req.session.isAuthenticated = true;
            req.session.isAdmin = user.isAdmin;
            next();
        })
        .catch(err => console.log(err));
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storage }).single("image"));  // In order to put image on forms
app.use(express.static(path.join(__dirname, "public")));


// Routers
app.use("*", locals) // "*" contains all routers // and we are adding middleware to them
app.use(userRouter);
app.use(accountRouter);
app.use("/admin", isAdmin, adminRouter);
app.use(errorController);


mongoose.connect(connectionString).then(() => {

    console.log("connected to mongodb succesfully!")

    app.listen(3000);

    server.listen().then(() => {
        console.log(`
        🚀  Server is running!
        🔉  Listening on port 4000
        📭  Query at http://localhost:4000`)

    }).catch(err => console.log(err))

}).catch(err => console.log(err));