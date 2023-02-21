require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const router = require('./router/routs')
const errorMiddleware = require('./middlewares/error-middleware')

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin','Access-Control-Allow-Credentials'],
    credentials: true
}));

app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
const websocket = require('./websocket')(app)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server is started on port ${PORT}`))
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
connectToMongoDB()


app.post('/draw/image', (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: "Loaded"})
    } catch (e) { 
        console.log(e)
        return res.status(500).json('error')
    }
})


app.get('/draw/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString('base64')
        res.json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json("error")
    }
} )


function deleteJpgFiles() {
    const filesPath = path.join(__dirname, '/files');
    fs.readdir(filesPath, (err, files) => {
        if (err) {
          throw err;
        }
  
        for (const file of files.filter(file => file.endsWith('.jpg'))) {
          fs.unlink(path.join(filesPath, file), err => {
              if (err) throw err;
          });
        }
      });
    }
  setInterval(deleteJpgFiles, 20 * 60 * 1000);
