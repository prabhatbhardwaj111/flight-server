import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import pkg from 'express-validator';
import { login, getFlightList , addNewFlight, isAuthorized} from './service.js';
import cors from 'cors';
const { body, validationResult } = pkg;
const app = express();
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req, res, next) => {

    fs.readFile("./data/user.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        console.log("File data:", jsonString);
    });

    res.json({ message: "from index api" });

});

app.post("/login",
    body('username').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
    body('password').isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const username = req.body.username;
        const password = req.body.password;
        const token = login(username, password);
        console.log(token)
        if (token) {
            res.status(200).json({ message: "Login Success", access_token: token });
        } else {
            res.status(401).json({ message: "Invalid login details" });
        }
    });



app.get("/flight-list", (req, res, next) => {
    const flightList = getFlightList();
    res.status(200).json({ message: "Flight List", data: flightList });
})


app.post("/add-flight",isAuthorized,
    body('from').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
    body('to').isLength({ min: 2 }).withMessage('must be at least 6 chars long'),
    body('departureTime').isLength({ min: 2 }).withMessage('must be at least 6 chars long'),
    body('landingTime').isLength({ min: 2 }).withMessage('must be at least 6 chars long'),
    body('price').isLength({ min: 2 }).withMessage('must be at least 6 chars long'),
    (req, res, next) => {
        const from = req.body.from;
        const departureTime = req.body.departureTime;
        const to = req.body.to;
        const landingTime = req.body.landingTime;
        const price = req.body.price;

        const flightList = addNewFlight(from, to, departureTime, landingTime, price);
        res.status(200).json({ message: "Flight List", data: flightList });
    })



app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
});