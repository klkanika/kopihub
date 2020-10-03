import express from 'express'
import { log, settings, use, server } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import socketio from 'socket.io'
import http from 'http'
import cors from "cors"


export const io = socketio.listen(server.raw.http,{
  path:'/socket'
});

io.on("connection",()=>{
  console.log('Connected')  
  // setTimeout(()=>{
    // console.log('Send Data To Client')
    io.emit('broadCastMessege',"fromServerrr")//ยิงงงงง
    io.emit('dataUpdate',{x:1,y:2})
    // io.emit('eventx',{})
    // io.emit('evnetY',[])
  // },2000)  
  
})



use(prisma({ features: { crud: true } }))


settings.change({
  schema: {
    connections: {
      foobar: {},
      toto: {},
    },
  },
  server: {
    cors:true,
    startMessage: (info) => {
      settings.original.server.startMessage(info)
      log.warn('piggy back message!')
    },
  },
})