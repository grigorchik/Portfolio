import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';
import {hash} from "bcrypt";
import post from "../models/Post.js";

// Один пользователь может иметь несколько постов
UserModel.hasMany(PostModel, {foreignKey: 'user'});
// Каждый пост принадлежит одному пользователю
PostModel.belongsTo(UserModel, {foreignKey: 'user'});

export const create = async (req, res) => {
    try {
        const post = await PostModel.create({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,

        })
        res.json(post);
    } catch (err) {
        console.error('Ошибка создания статьи:', err);
        res.status(500).json({
            message: 'Ошибка создания статьи'
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = await PostModel.findOne({
            where: {
                id: postId
            },
            returning: true
        })
        if (!post) {
            return res.status(404).json({message: 'Post not found'});
        } else {
            post.viewsCount += 1;
        }
        await post.save();
        res.json({
            post
        });
    } catch (err) {
        console.error('Ошибка получений поста:', err);
        res.status(500).json({
            message: 'Ошибка получений поста'
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.findAll({
            include: [{
                model: UserModel,
                attributes: ['id', 'email', 'fullName'],
            }]
        });

        res.json(posts);
    } catch (err) {
        console.error('Не удалось получить статьи:', err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
}

export const remove = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = await PostModel.findOne({
            where: {
                id: postId
            }
        })
        if (!post) {
            return res.status(404).json({message: 'Post not found'});
        } else {
            await post.destroy();
        }


    } catch (err) {
        console.error('Ошибка получений поста:', err);
        res.status(500).json({
            message: 'Ошибка получений поста'
        });
    }
}

export const update = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = await PostModel.findOne({
            where: {
                id: postId
            },
            returning: true
        })
        if (!post) {
            return res.status(404).json({message: 'Post not found'});
        } else {
            await PostModel.update(
                {
                    title: req.body.title,
                    text: req.body.text,
                    tags: req.body.tags,
                    imageUrl: req.body.imageUrl
                },
                {
                    where: { id: postId },
                    returning: true, //обеспечивает возвращение обновленных данных.
                    plain: true     //возвращает только одну запись (объект).
                }
            );
        }
        const updatedPost = await PostModel.findOne({
            where: { id: postId }
        });

        res.json(updatedPost);

    } catch (err) {
        console.error('Ошибка получений поста:', err);
        res.status(500).json({
            message: 'Ошибка получений поста'
        });
    }
}