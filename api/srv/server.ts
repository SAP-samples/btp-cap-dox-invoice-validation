import cds from "@sap/cds";
const express = require("express");

cds.on("bootstrap", (app) => {
    app.use(express.static(__dirname + "/files"));
});
