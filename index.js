const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const validMiddleware = require('./middlewares/validMiddleware');
const mongoose = require('mongoose');
const Page = require('./models/Page');
const db = require('./config/db/index');
const fetch = require('node-fetch');

const Redis = require('ioredis'); 
const { redirect } = require('express/lib/response');
const redisClient = new Redis({
  
})

// connect db
db.connectDb();

// List item form db
app.get('/list',  (req, res, next)=> {
  Page.find({})
    .then(page => {
      res.json(page)
    })
    .catch(next)
})


app.use(bodyParser.json());


// Middleware test: if param ?level > 10 -> pass middleware
app.get('/page', validMiddleware, (req, res)=> {
    res.send('pass middleware')
})
app.get('/', (req, res) => {
    res.send('Home')
  })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// init cache
app.get('/cache', async (req, res, next) => {
  await redisClient.set('lastime', Date.now())
  let lasttime = await redisClient.get('lastime')
  await redisClient.set('isUpdate', 1)
  console.log(lasttime)
  res.redirect('/ioredis')
})

// ioredis test
app.get('/ioredis',  async (req, res, next) => {
  let truePrice = 20;
  await redisClient.set('Price', 10)
  
  //let updateTimes = await redisClient.get('isUpdate')
  let lasttime = await redisClient.get('lastime')

  let isLongTime = false

  if (lasttime) {
    const calculateTime = Date.now() - lasttime
    isLongTime = calculateTime > 10000
  }

  let Price 
  let statusLock = await redisClient.incr('isUpdate')
  console.log(statusLock)

  if (statusLock > 1 || isLongTime){
    Price =  await redisClient.get('Price')
    console.log(Price)
    console.log(statusLock)
    res.send('Price '+ Price + '      statusLock ' +statusLock)
    
  } else {
    Price = truePrice;
    await redisClient.del('isUpdate')
    console.log(Price)
    res.send('Price '+ Price)

  }
})