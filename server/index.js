const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.json({
        message: "Hello there! General Kenobi!"
    });
});

function isValidMessage(myMessage) {
    return myMessage.name && myMessage.name.toString().trim() !== '' && myMessage.content && myMessage.content.toString().trim() !== '';
}

app.post('/message', (req, res) => {
    if (isValidMessage(req.body)) {
        const message = {
            name: req.body.name.toString(),
            content: req.body.content.toString()
        };
        console.log(message);

    } else {
        res.status(422);
        res.json({
            message: "Name and content is required!"
        });
    }
});

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000')
});