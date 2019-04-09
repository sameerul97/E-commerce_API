# E-Commerce Node API
Created an RESTful API using Express JS and uses MongoDB as data warehouse. 
Used mLab as DataSource. 
Hosted the Node API in Raspberry Pi 
### 🚀 [Demo](http://ecomapi.sameerul.com:3009/allPhones)

## ⚙ Installation
npm install 

## Run
node app.js

## Python file (web_Scraping_2.py)
There is a python script file which automatically scrapes the web and creates an JSON file containning all the data required for the API.

## Script file (rest.js)
This file is incharge of pushing all the Data collected using Python to MongoDB. Simply pushing data one by one in a loop.

## Routes 
### Best selling
http://ecomapi.sameerul.com:3009/bestselling
### Mostly wished
http://ecomapi.sameerul.com:3009/mostlywished
### Mostly reviewed 
http://ecomapi.sameerul.com:3009/mostlyreviewed