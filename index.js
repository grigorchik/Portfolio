import express from 'express';
import pkg from 'pg';
import {registerValidation} from './Validation/auth.js';
import UserModel from './models/User.js';
import * as UserController from './controllers/UserController.js';
import CheckAuth from "./utils/checkAuth.js";

const app = express();
app.use(express.json());
const {Client} = pkg;

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
/////// Для создания таблицы
UserModel.sync({force: false})  // Создает таблицу, если ее нет
    .then(() => {
        console.log('User table synced');
    })
    .catch(err => {
        console.error('Error syncing User table:', err);
    });

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server running on port 4444 ');
});

//////

app.post('/auth/register', registerValidation, UserController.register);

app.post('/auth/login', UserController.login);

app.get('/auth/me',CheckAuth, UserController.getMe);

/////



