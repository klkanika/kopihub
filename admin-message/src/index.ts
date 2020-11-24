import express from "express";
import bodyParser from 'body-parser'

const { PORT } = process.env
const app = express();

app.use(bodyParser.json());

// define a route handler for the default home page
// app.get( "/", ( req, res ) => {
//   res.send( "Hello world!" );
// });

app.post("/api/admin-message" , async (req,res) => {
  console.log(req.body);      // your JSON
  res.send(req.body);    // echo the result back
} );

// start the Express server
app.listen( PORT || 3030, () => {
    console.log( `server started at http://localhost:${ PORT || 3030 }` );
} );


