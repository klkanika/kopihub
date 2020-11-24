import express from "express";
import bodyParser from 'body-parser'
import fetch from 'node-fetch'

const { API, PORT } = process.env
const app = express();

app.use(bodyParser.json());

// define a route handler for the default home page
// app.get( "/", ( req, res ) => {
//   res.send( "Hello world!" );
// });

app.post("/api/admin-message" , async (req,res) => {
  console.log(req.body);      // your JSON
  // if(req.body.tel)
  try{
    if(req.body.tel==="ข้อความ<<|>>ออย"){
      await insertMessage(req.body.msg,req.body.tel);
    }
  }catch(ex){
      console.log(ex)
  }
  res.send(req.body);    // echo the result back
} );

// start the Express server
app.listen( PORT || 3030, () => {
    console.log( `server started at http://localhost:${ PORT || 3030 }` );
} );

const insertMessage = async (msg : string, tel : string) =>{
  console.log( `insertMessage`,msg,tel);
  if(msg && msg !== ""){
    const res = await (await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: CREATE_OTP,
          variables: {
            username: "root",
            message: msg,
            tel: tel
          }

        })
      })).json();
  }
  
}


const CREATE_OTP = `
mutation 
    createOneOTP(
    $username: String!
    $message: String!
    $tel: String!
  )
  {
    createOneOTP(
        data : {
            user : {connect : { userName : $username}}
            message : $message
            tel : $tel
        }
    ){
        id
        message
        tel
    }
  }
`