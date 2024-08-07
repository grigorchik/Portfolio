import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
    .connect('mongodb+srv://admin:qpmz123321@cluster0.lo6e6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("ERROR  ", + err));

const app = express();

app.use(express.json());

//Если придет get запрос к приложения на главный путь, то вернется два параметра
app.get('/', (req,res) =>{
    res.send('Welcome to Portfolio!');
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign({
            email: req.body.email,
            fullName: 'Иван Петров',
        },
        'secret123');



    res.json({
        success: true,
        token
    });
})





app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server running on port 4444');
});

