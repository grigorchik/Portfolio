import express from 'express';

const app = express();
//Если придет get запрос к приложения на главный путь, то вернется два параметра
app.get('/', (req,res) =>{
    res.send('Welcome to Portfolio!');
});

app.post('/auth/login', (req, res) => {
    res.json({
        success: true,

    });
})

app.listen(3000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server running on port 3000');
});

