import express from "express";
import request from "request";
import moment from "moment";
import fetch from 'node-fetch'
import { parse } from "path";

const API = 'http://localhost:4000/graphql'
const PORT = 3030; // default port to listen
// const { API, PORT } = process.env
const app = express();

const timeFormat = "HH:mm";
const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DD HH:mm";

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
// app.post("/sync-order" , async (req,res) => {
    res.send( "Hello world!" );
    // try{
    //     getNotifications();
    //     console.log("fetched")
    // }catch(ex){
    //     console.log(ex)
    // }
} );

// start the Express server
app.listen( PORT || 3030, () => {
    console.log( `server started at http://localhost:${ PORT || 3030 }` );

    const interval = 10
    setInterval(async () => {
        getNotifications()
        
    }, interval * 1000)
} );

const logTime = async (now: string, time: string, id: string, message: string,token: string) => {
    if(now == time){
        await (sendLineNotify(token, message))
        const res = await (await fetch(API, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              query: CREATE_NOTIFY_LOG,
              variables: {
                username: "root",
                notifyId: id
              }
    
            })
          })).json();
    }
}

const sendLineNotify = async (token: string, message: string) => {
    request({
        method: 'POST',
        uri: 'https://notify-api.line.me/api/notify',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          'bearer': token
        },
        form: {
          message: message
        }
    }, (err, httpResponse, body) => {
        if(err){
            console.log('sendLineNotify', err);
        } else {
            console.log('sendLineNotify', body)
        }
    });
}

const getNotifications = async () =>{
    
    const startTime = moment(moment(moment().format(dateFormat) + " 00:00").format(dateTimeFormat)).toDate()
    const endTime = moment(moment(moment().add(1, 'days').format(dateFormat) + " 00:00").format(dateTimeFormat)).toDate()
    const notifications = await (await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: GET_NOTIFICATIONS,
          variables: {
            startTime: startTime,
            endTime: endTime
          }
        })
      })).json();
    
    notifications.data.notifications.map((t : any) => {
        const h = t.hour < 10 ? "0" + t.hour : t.hour
        const m = t.minute < 10 ? "0" + t.minute : t.minute
        const time = moment(h + ':' + m ,timeFormat).format(timeFormat)
        const now = moment().format(timeFormat)
        if(now <= time)
            logTime(now, time, t.id, t.message, t.token)
    })
}

const GET_NOTIFICATIONS = `
query 
notifications(
    $startTime: DateTime
    $endTime: DateTime
  )
  {
    notifications(
      where : {
        NotificationLog : 
          {every : 
            {NOT : 
              [{AND : [{createdAt : {gte: $startTime}}
                        ,{createdAt : {lt: $endTime}}]}]}}
      }
    ){
      id
      message
      hour
      minute
      token
    }
  }
`

const CREATE_NOTIFY_LOG = `
mutation 
    createOneNotificationLog(
    $username: String!
    $notifyId: String!
  )
  {
    createOneNotificationLog(
        data : {
            user : {connect : { userName : $username}}
            notification : 
                {connect : {id: $notifyId }}
        }
    ){
        id
        notificationId
        createdAt
    }
  }
`