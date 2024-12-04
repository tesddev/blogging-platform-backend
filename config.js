const express = require('express');
require("dotenv").config()

module.exports = {
    port: process.env.PORT || 8001,
    connectionstring: process.env.CONNECTION_STRING,
    jwtSecret: process.env.JWT_SECRET
};