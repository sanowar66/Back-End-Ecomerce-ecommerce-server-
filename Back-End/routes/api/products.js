const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticateToken = require('../../middleware/auth')
const multer = require('multer');

const Product = require('../../models/Product')
const File = require('../../models/File')
const User = require('../../models/User')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName)
    }
})
const upload = multer({ storage: storage })

//upload a file
router.post("/uploads", upload.single("file"), async(req, res) => {
    const productObj = {
        name: req.file.filename,
        path: req.file.path
    }
    const file = new File(productObj)
    await file.save()
    res.status(201).json(file)
    console.log("file Uploaded")
})


//create a product
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role != "admin") {
      return res.status(400).json({ message: "You are not an admin" });
    }

    const userId = req.user.id;

    const productObj = {
      name: req.body.name,
      desc: req.body.desc,
      madeIn: req.body.madeIn,
      price: req.body.price,
      fileId: req.body.fileId,
      userId: userId,
    };

    const product = new Product(productObj);
    await product.save();
    if (product?.fileId) {
      const createdProduct = await Product.findById(product._id).populate(["fileId", "userId"]).exec();
      res.status(201).json(createdProduct);
    } else {
      res.status(201).json(product);
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
});


module.exports = router;