import express from "express";

const { PORT } = process.env
const app = express();

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
  res.send( "Hello world!" );
});

app.post("/api/admin-message" , async (req,res) => {
    console.log('call api/admin-message')
    console.log('req', req)
    res.send("ok")
} );

// start the Express server
app.listen( PORT || 3030, () => {
    console.log( `server started at http://localhost:${ PORT || 3030 }` );
} );


