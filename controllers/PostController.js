import PostModel from '../models/Post.js';
import {hash} from "bcrypt";

export const create =async (req, res) => {
    try {
        const post = await PostModel.create({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,

        })
        res.json(post);
    } catch (err){
        console.error('Ошибка создания статьи:', err);
        res.status(500).json({
            message: 'Ошибка создания статьи'
        });
    }
};