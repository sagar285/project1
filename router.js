const express = require("express");
const Router = express.Router();
const user = require("./database");
const bcrypt = require("bcryptjs");
const cookieparser =require("cookie-parser");
const auth =require("./authorization");

//this is home page route
Router.get("/", (req, res) => {
  res.render("index");
 
});

// this is loginpage by navbar

Router.get("/loginn", (req, res) => {

  res.render("login");
});



// this is authoriazation page
Router.get("/auth",auth, (req, res) => {

  res.render("auth");
});


// this is user registration page
Router.post("/register", async (req, res) => {
  try {
    const data = new user(req.body);
    if (data.password === data.confpassword) {
      const emailvalidation = await user.findOne({ email: data.email });
      if (emailvalidation) {
        res.send("this email already exist pls login");
      }

      const token = await data.generateToken();
      console.log("this token is user" + token);

      res.cookie("jwt",token);

      const savedata = await data.save();
      res.render("login");
    } else {
      res.status(400).send("this is not right pls fill correct detail");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});


//user login route /page

Router.post("/login", async (req, res) => {
  try {
    console.log("login page");
    const passworduser = req.body.password;
    const checkemail = req.body.email;
    const databasedata = await user.findOne({ email: checkemail });
    const ismatch = await bcrypt.compare(passworduser, databasedata.password);
    console.log("login page"+ismatch);
    if (ismatch) {
      const token = await databasedata.generateToken();
      res.cookie("jwt",token);
      res.render("contact");
      //   res.send(`<h1>${databasedata.email}</h1>`)
    } else {
      res.status(400).send("this is not right pls fill correct detail");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// user logout route


Router.get("/logout",auth, async(req, res) => {
  try {
    req.user.tokens=[];
    res.clearCookie("jwt")
    const userdata =await req.user.save();
    // req.user.tokens=[];
    // res.clearCookie("jwt");
    // await req,user.save()
    res.render("login");

  } catch (error) {
    res.status(500).send(error);
    
  }

});

// export router for import in express app
module.exports = Router;
