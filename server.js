
let express = require('express')

let app = express()
const path = require('path');
let PORT = 3000;
const mongoose = require('mongoose');
const { request } = require('http');
app.use(express.static(__dirname))
app.use(express.json())

require('dotenv').config();
let userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    CIN: { type: String, required: true },
    INFO: { type: String, required: true },
    joinDate: { type: String, required: true },
    endDate: { type: String, required: true }

})
let user = mongoose.model('User', userSchema)

mongoose.connect(process.env.MONGO_URL, { family: 4 })

    .then(() => console.log('Connected to MongoDB Atlas!'))
    .catch(err => console.error('Connection Error:', err));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'respons.html'))

})
app.post('/secretcode', (request, response) => {
    const {usercode} = request.body
    console.log('user code is ' + usercode)
    if (usercode === process.env.SECRET_CODE) {
        response.json(true)
    } else {
      response.json(false)
    }
})

app.get('/getData', async (request, response) => {
    try {
        let dataUser = await user.find()
        response.status(200).json(dataUser)

    } catch (error) {
        response.status(500).send('Error retrieving data');
    }
})
app.post('/new/data', async (request, response) => {


    try {

        const usersArray = request.body.data;

        const result = await user.insertMany(usersArray);


        response.status(200).send('successfully saved to database');
    } catch (error) {
        response.status(500).send('Error saving to database');
        response.status(500).send(error.message);
    }
});
app.put('/update/data', async (request, response) => {
    try {
        const newData = request.body.data[0];

        const updateResult = await user.findByIdAndUpdate(
            newData.id,
            { name: newData.name, CIN: newData.CIN, INFO: newData.INFO, joinDate: newData.joinDate, endDate: newData.endDate },
            { returnDocument: 'after' }

        )

        if (!updateResult) {
            response.status(404).send('User not found');
        }
        response.status(200).send('successfully updatedn to database');

    } catch (error) {
        response.status(500).send('Error updating database');
        console.error('Error updating database:', error);
    }
})
app.delete('/delet/data/:id', async (request, response) => {
    var dataDelete = request.params.id

    let deletResult = await user.findByIdAndDelete(dataDelete)

})



app.listen(3000, () => {
    console.log('server is running on port 3000 HIIHAAA again')
    console.log('http://localhost:3000/bosslogin.html')
    console.log("الرابط المستلم هو:", process.env.MONGO_URI);

})

