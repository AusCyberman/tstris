const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(path.join(__dirname,"dist")));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
    console.log("hi")
  res.sendFile(path.resolve(__dirname, path.join("dist",'index.html')));
});

app.listen(port);