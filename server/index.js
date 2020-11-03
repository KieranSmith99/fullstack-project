const express = require('express');
const app = express();
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const db = monk('localhost/message');
const messages = db.get('myMessages');
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.json({
        message: "Hello world"
    });
});

app.get('/message', (req, res) => {
    messages
        .find()
        .then(messages => {
            res.json(messages);
        });
});

function isValidMessage(myMessage) {
    return myMessage.name && myMessage.name.toString().trim() !== '' && myMessage.content && myMessage.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1
}));

app.post('/message', (req, res) => {
    if (isValidMessage(req.body)) {
        const message = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        messages
            .insert(message)
            .then(createdMessage => {
                res.json(createdMessage);
            });

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