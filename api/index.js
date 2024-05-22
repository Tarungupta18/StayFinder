const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Place = require('./models/Place.js');
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'tarun';
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors({
    credentials: true,
    origin:'http://localhost:5173'
}));

// console.log(process.env.MONGO_URL);
// mongoose.connect(process.env.MONGO_URL);

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

app.get("/test", (req, res) => {
    res.json("test ok");
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    console.log({ name });
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json("bad");
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            try {
                const { name, email, _id } = await User.findById(userData.id);
                res.json({ name, email, _id });
            } catch (err) {
                res.status(500).json({ error: 'Failed to fetch user data' });
            }
        });
    } else {
        res.json(null);
    }
});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'phtoto' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
})

const photosMiddleware = multer({ dest: 'uploads' });
app.post("/upload", photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path: tempPath, originalname } = req.files[i];
        const ext = path.extname(originalname);
        const newPath = `${tempPath}${ext}`;
        fs.renameSync(tempPath, newPath);
        const filename = path.basename(newPath);
        uploadedFiles.push(filename);
    }
    res.json(uploadedFiles);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const placeDoc = await Place.create({
                owner: userData.id,
                title, address, photos: addedPhotos,
                description, perks, extraInfo,
                checkIn, checkOut, maxGuests, price
            })
            res.json(placeDoc);
        })
})

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    })
})

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
})

app.put('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
        id, title, address, addedPhotos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests, price } = req.body;
    
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos,
                description, perks, extraInfo,
                checkIn, checkOut, maxGuests, price,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places', async (req, res) => {
    res.json(await Place.find());
})

app.listen(4000, () => {
    console.log("port is listening at 4000");
});