const express = require("express");
const cors = require("cors");
require("./db/config");
const Product = require("./db/Product");
const User = require("./db/User");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "no user found" });
    }
  } else {
    res.send({ result: "no user found" });
  }
});

app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/get-product/:id", async (req, res) => {
  if (req.params.id) {
    let product = await Product.find({
      $or: [{ userId: { $regex: req.params.id } }],
    });
    res.send(product);
  } else {
    res.send({ result: "No data found" });
  }
});

app.delete("/delete-product/:_id", async (req, res) => {
  let deleteProduct = await Product.deleteOne({
    _id: req.params._id,
  });
  res.send(deleteProduct);
});

app.listen(5000, () => {
  console.log("server runing on port 5000");
});
