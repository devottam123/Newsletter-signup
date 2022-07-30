const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const app = express();

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lastN;
  const email = req.body.email;
  const listId = process.env.LIST_ID;
  console.log(firstName, lastName, email);

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  const run = async function run() {
    try{
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    console.log(response);
    res.sendFile(__dirname + "/success.html");
  } catch (err){
    console.log(err.status);
    res.sendFile(__dirname + "/failure.html");
  }
};

  run();
});

app.post("/failure", function(req, res){
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.")
})
