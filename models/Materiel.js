const mongoose = require("mongoose");
//var express = require('express');
const bodyparser = require("body-parser");
const Schema = mongoose.Schema;
const materielSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    dispo: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
  
    },
    nameUser: {
      type: String,
  
    },
    Prix: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Materiel", materielSchema);
