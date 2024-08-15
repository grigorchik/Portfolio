import express from 'express';
import multer from 'multer';
import pkg from 'pg';
import {registerValidation, loginValidation, postCreateValidation} from './Validations.js';
import UserModel from './models/User.js';
import PostModel from './models/Post.js';
import {PostController, UserController} from './controllers/index.js';
import {checkAuth, handleValidationErrors} from "./utils/index.js";

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
const {Client} = pkg;

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.filename}`,
    })
});

// Configuration for PostgreSQL
const config = {
    host: '192.168.10.103',
    user: 'portfolio',
    password: 'portfolio',
    database: 'myportfolio',
    port: 5432,
    ssl: {
        rejectUnauthorized: false // В случае самоподписанного сертификата
    }
};
// Creating a new PostgreSQL client
const client = new Client(config);

client.connect(err => {
    if (err) {
        console.error('Failed to connect to the database', err.stack);
    } else {
        console.log('Connected to DB postgresql');
        //queryDatabase();
    }
});
/////// Для создания таблицы users // Создает таблицу, если ее нет
UserModel.sync({force: false}).then(() => {
    console.log('User table synced');
}).catch(err => {
    console.error('Error syncing User table:', err);
});
////// posts
PostModel.sync({force: false}).then(() => {
    console.log('Posts table synced');
}).catch(err => {
    console.error('Error syncing PostModel:', err);
})
/////
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server running on port 4444 ');
});

//////

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/posts', postCreateValidation, checkAuth, PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', postCreateValidation, checkAuth, PostController.update);





