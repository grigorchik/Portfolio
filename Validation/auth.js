import {body} from 'express-validator';


export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Имя минимум 3 символа').isLength({min: 3}),
    body('avatarUrl', 'Аватар долежен быть URL').optional().isURL(),

]