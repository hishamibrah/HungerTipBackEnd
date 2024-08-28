// server.js
const express = require("express");
const app = express();
require("dotenv/config"); // configure reading from .env
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
// http://localhost:3000
// app.use(
//   cors({
//     origin: ["*"],
//     methods: "GET,POST,PUT,DELETE,OPTIONS",
//   })
// );
app.use(cors({
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}));
app.use(express.json());


const mongoose = require('mongoose')

//import routes
// const transactionRoutes = require('./routes/transactions.routes')
// const walletRoutes = require('./routes/wallets.routes')
async function main () {
  const res = await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.3wyp1zs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
}

main().then(res=>console.log('Mongodb sucessfully connected')).catch(err => console.log(err))

//config routes
// app.use('/', transactionRoutes)
// app.use('/', walletRoutes)

app.listen("3200", () => console.log("Server running on port 3200"));
console.log('po')
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
console.log('po2')
async function verifyGoogleToken(token) {
  console.log('oko')
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

app.post("/login", async (req, res) => {
  console.log('oko')
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      // const existsInDB = DB.find((person) => person?.email === profile?.email);

      // if (!existsInDB) {
      //   return res.status(400).json({
      //     message: "You are not registered. Please sign up",
      //   });
      // }
      console.log(2)
      res.status(201).json({
        message: "Login was successful",
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      });
    }
  } catch (error) {
    console.log('pika')
    res.status(500).json({
      message: error?.message || error,
    });
  }
});