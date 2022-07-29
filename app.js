const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

mailchimp.setConfig({
  apiKey: "7012a71c506460bf7403eba0d2094627-us14",
  server: "us14",
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
  const listId = "0b2e84e26b";
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
