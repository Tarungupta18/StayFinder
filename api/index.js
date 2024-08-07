const express = require("express");
require('dotenv').config();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const cookieParser = require("cookie-parser");
const multer = require('multer');
const { cloudinary } = require('./cloudConfig.js');
const { storage } = require('./cloudConfig.js');
const fs = require('fs');
const path = require('path');
const Place = require('./models/Place.js');
const Booking = require("./models/Booking.js");
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'tarun';
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin:'http://localhost:5173'
}));


main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

app.get("/api/test", (req, res) => {
    res.json("test ok");
});

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    })
}

app.post("/api/register", async (req, res) => {
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

app.post('/api/login', async (req, res) => {
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

app.get('/api/profile', (req,res) => {
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


app.post('/api/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/api/upload-by-link', async (req, res) => {
    const { link } = req.body;
    console.log(link);
    try {
        const result = await cloudinary.uploader.upload(link, {
            folder: 'stayfinder'
        });
        console.log(result.url);
        console.log("done");
        res.json(result.url);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

const photosMiddleware = multer({ storage });
app.post('/api/upload', photosMiddleware.array('photos', 100), async (req, res) => {
    const uploadedFiles = [];

    for (let i = 0; i < req.files.length; i++) {
        const { path: tempPath } = req.files[i];

        try {
            // Upload file to Cloudinary
            const result = await cloudinary.uploader.upload(tempPath, {
                folder: 'stayfinder'
            });

            // Store secure URL in uploadedFiles array
            uploadedFiles.push(result.secure_url);

            // Delete temporary file after upload
            fs.unlinkSync(tempPath);
        } catch (e) {
            console.error('Error uploading file:', e);
            res.status(500).json({ error: 'Failed to upload image' });
            return;
        }
    }

    // Respond with array of uploaded file URLs
    res.json(uploadedFiles);
});

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/places', (req, res) => {
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

app.get('/api/user-places', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    })
})

app.get('/api/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
})

app.put('/api/places', async (req, res) => {
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

app.get('/api/places', async (req, res) => {
    res.json(await Place.find());
});

app.post('/api/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price
    } = req.body;
    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price, user:userData.id
    }).then((doc) => {
        res.json(doc);
    }).catch((err)=>{
        throw err;
    })
});



app.get('/api/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({ user: userData.id }).populate('place'));
});


app.listen(4000, () => {
    console.log("port is listening at 4000");
});