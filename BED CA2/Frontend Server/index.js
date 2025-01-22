const express = require("express");
const app = express();

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.sendFile("/public/index.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
  res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/dvd/", (req, res) => {
  res.sendFile("/public/dvd.html", { root: __dirname });
});

app.get("/addActors/", (req, res) => {
  res.sendFile("/public/addActors.html", { root: __dirname });
});

app.get("/addCustomer/", (req, res) => {
  res.sendFile("/public/addCustomer.html", { root: __dirname });
});

app.get("/dvdDetails/", (req, res) => {
  res.sendFile("/public/dvdDetails.html", { root: __dirname });
});

app.get("/cart/", (req, res) => {
  res.sendFile("/public/cart.html", { root: __dirname });
});

app.get("/checkout/", (req, res) => {
  res.sendFile("/public/checkout.html", { root: __dirname });
});

const PORT = 3001;
app.listen(PORT, () => {
//   console.log(`Client server has started listening on port ${PORT}`);
    console.log(`FrontEnd server started on port ${PORT}`);
});
