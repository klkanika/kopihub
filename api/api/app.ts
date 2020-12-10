// import express from 'express'
import { log, settings, use, server } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import bodyParser from 'body-parser';
import ImgUpload from './imgUpload';
import serveStatic from 'serve-static';
import multer from 'multer';
// import socketio from 'socket.io'
// import http from 'http'
// import cors from "cors"


// export const io = socketio.listen(server.raw.http,{
//   path:'/socket'
// });

// io.on("connection",()=>{
//   console.log('Connected')  
//   // setTimeout(()=>{
//     // console.log('Send Data To Client')
//     io.emit('broadCastMessege',"fromServerrr")//ยิงงงงง
//     io.emit('dataUpdate',{x:1,y:2})
//     // io.emit('eventx',{})
//     // io.emit('evnetY',[])
//   // },2000)  

// })



use(prisma({ features: { crud: true } }))


settings.change({
  schema: {
    connections: {
      foobar: {},
      toto: {},
    },
  },
  server: {
    cors: true,
    startMessage: (info) => {
      settings.original.server.startMessage(info)
      log.warn('piggy back message!')
    },
  },
})

// SET STORAGE
var storage = multer.memoryStorage()
// var storage = multer.diskStorage({})
var upload = multer({ storage: storage })
var cors = require('cors')
server.express.post('/uploadfile', cors(), upload.single('myFile'), ImgUpload, (req: any, res: any, next: any) => {
  // console.log('uploadfile',req.file)
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    // error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
})

server.express.use('/uploads', serveStatic('uploads'))
server.express.use(bodyParser.urlencoded({ extended: true }))