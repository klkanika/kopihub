import express from "express";
import request from "request";
import moment from "moment";
import fetch from 'node-fetch'
import { parse } from "path";

// const API = 'http://localhost:4000/graphql'
// const PORT = 3030; // default port to listen
const { API, PORT } = process.env
const app = express();

const timeFormat = "HH:mm";
const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DD HH:mm";

// define a route handler for the default home page
// app.get( "/", ( req, res ) => {
//   res.send( "Hello world!" );
// });

app.post("/notify" , async (req,res) => {
    try{
        await getNotifications();
        console.log("fetched")
    }catch(ex){
        console.log(ex)
    }

    res.send("ok")
} );

// start the Express server
app.listen( PORT || 3030, () => {
    console.log( `server started at http://localhost:${ PORT || 3030 }` );

    // const interval = 60
    // setInterval(async () => {
    //     getNotifications()
        
    // }, interval * 1000)
} );

const logTime = async (now: string, time: string, id: string, message: string,token: string) => {
    console.log( `logTime id:${id}, message:${message}, token:${token}, time:${time} ` );
    if(message && message !== "" && token && token !== ""){
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
                notifyId: id,
                message: message,
                token: token
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
            console.log('sendLineNotify Error', err);
        } else {
            console.log('sendLineNotify Complete', body)
        }
    });
    
}

const getNotifications = async () =>{
    console.log( `getNotifications` );
    const notifications = await (await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: GET_NOTIFICATIONS,
        })
      })).json();
    
    notifications.data.notifications.map((t : any) => {
        
        const h = t.hour < 10 ? "0" + t.hour : t.hour
        const m = t.minute < 10 ? "0" + t.minute : t.minute
        console.log( `Notifications id:${t.id}, message:${t.message}, token:${t.token}, hour:${t.hour}, minute:${t.minute} ` );
        const time = moment(h + ':' + m ,timeFormat).format(timeFormat)
        const now = moment().utcOffset('+0700').format(timeFormat)
        const nowDay = moment().utcOffset('+0700').day()
        const isDayNotify = ((nowDay == 1 && t.mon == true) || (nowDay == 2 && t.tue == true) || (nowDay == 3 && t.wed == true) || (nowDay == 4 && t.thu == true)
          || (nowDay == 5 && t.fri == true) || (nowDay == 6 && t.sat == true) || (nowDay == 7 && t.sat == true))
        console.log( `Notifications id:${t.id}, message:${t.message}, token:${t.token}, time:${time} ,isDayNotify:${isDayNotify}` );
        console.log( `Log condition:${(moment(now,timeFormat).diff(moment(time,timeFormat)) == 0 && isDayNotify)}, now:${now} ` );

        if(moment(now,timeFormat).diff(moment(time,timeFormat)) == 0 && isDayNotify){
            logTime(now, time, t.id, t.message, t.token)
        }
    })
}


const GET_NOTIFICATIONS = `
query {
  notifications{
    id
    message
    hour
    minute
    token
    mon
    tue
    wed
    thu
    fri
    sat
    sun
  }
}
`

const CREATE_NOTIFY_LOG = `
mutation 
    createOneNotificationLog(
    $username: String!
    $notifyId: String!
    $message: String!
    $token: String!
  )
  {
    createOneNotificationLog(
        data : {
            user : {connect : { userName : $username}}
            notification : 
                {connect : {id: $notifyId }}
            message : $message
            token : $token
        }
    ){
        id
        notificationId
        createdAt
    }
  }
`