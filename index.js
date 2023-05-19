const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const toy = require('./data/toy.json')
const category = require('./data/category.json')

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('toy car is running');
})

app.get('/toy', (req, res) => {
    res.send(toy);
})
app.get('/category', (req, res) => {
    res.send(category);
})
app.listen(port, () => {
    console.log(`toy car is running on prot: ${port}`);
})