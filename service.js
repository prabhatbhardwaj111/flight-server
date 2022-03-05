import express from "express";
import fs from "fs";
import crypto from "crypto";


export const login = function (username, password) {
    const jsonString = fs.readFileSync('./data/user.json', 'utf8');
    const userList = JSON.parse(jsonString);
    const found = userList.find((element) => element.username == username && element.password == password);
    let token = '';
    if (found) {
        const index = userList.findIndex((element) => element.username == username && element.password == password);
        token = crypto.randomBytes(20).toString('hex');
        found.token = token;
        userList[index] = found;
        fs.writeFile("./data/user.json", JSON.stringify(userList), err => {
            if (err) console.log("Error writing file:", err);
        });
    }
    return token;
}

export const getFlightList = function () {
    const flightData = fs.readFileSync('./data/flight.json', 'utf8');
    const flightDataList = JSON.parse(flightData);
    return flightDataList;
}

export const addNewFlight = function (from, to, departureTime, landingTime, price) {
    const flightData = fs.readFileSync('./data/flight.json', 'utf8');
    let flightDataList = JSON.parse(flightData);
    const newFlightJson = { from, to, departureTime, landingTime, price };
    flightDataList[flightDataList.length] = newFlightJson;
    fs.writeFile("./data/flight.json", JSON.stringify(flightDataList), err => {
        if (err) console.log("Error writing file:", err);
    });
    return newFlightJson;
}

export const isAuthorized = function (req, res, next) {

    const token = req.headers.token;
    const jsonString = fs.readFileSync('./data/user.json', 'utf8');
    const userList = JSON.parse(jsonString);
    const isAuthorized = userList.find((element) => element.token == token);
    if (isAuthorized == null) {
        res.json({ message: "You are not Authorized"});
        return next(err);
    } else {
        return next();
    }
}





