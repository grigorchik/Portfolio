import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import {registerValidation} from './Validation/auth.js';
import {validationResult} from "express-validator";
import UserModel from './models/User.js';

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
//////
app.post('/auth/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
        const user = await UserModel.create({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })

        const token = jwt.sign({
                id: user.id,
            },
            'secret123',
            {
                expiresIn: '30d',
            });
//Деструктуризация объекта и удаления поля passwordHash
        const userData = user.get({ plain: true });
        const { passwordHash, ...userWithoutPasswordHash } = userData;

        res.json({
            ... userWithoutPasswordHash,
            token,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Failed to register user'
        });
    }
});


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server running on port 4444 ');
});

