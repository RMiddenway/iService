const https = require("https");
module.exports = {
  mailChimpAdd: function (email, firstName, lastName) {
    // const password = user.password;
    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        },
      ],
    };
    jsonData = JSON.stringify(data);
    const url = "https://us6.api.mailchimp.com/3.0/lists/16dc3b98c4";
    const options = {
      method: "POST",
      auth: "rog:a9175f7c4e4ed1ce51a6e14d0dc49190-us6",
    };

    const request = https.request(url, options, (response) => {
      response.on("data", (data) => {
        console.log(JSON.parse(data));
      });
    });
    request.write(jsonData);
    request.end();
  },
};
