import cds from "@sap/cds";
const express = require("express");

cds.on("bootstrap", (app) => {
    app.use("/samples/", express.static(__dirname + "/samples"));
});
