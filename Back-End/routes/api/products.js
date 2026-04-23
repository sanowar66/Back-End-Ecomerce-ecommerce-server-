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
router.post("/uploads",[authenticateToken, upload.single("file")], async(req, res) => {
  if(req.user.role !="admin"){
    return res.status(400).json({ message: "You are not an admin" });
  }else{
    const productObj = {
        name: req.file.filename,
        path: req.file.path
    }
    const file = new File(productObj)
    await file.save()
    res.status(201).json(file)
    console.log("file Uploaded")
  }
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
//get all product

//get one product
router.get("/:id",authenticateToken,async (req,res)=>{
  try{
     const id=req.params.id
     const product=await Product.findById(id).populate(["fileId","userId"]).exec();
     if(product){
     res.json(product)
    }else{
     res.status(404).json({message:"Product Not Found."})
      }
  }catch{
    res.status(500).json({message:"Something went worng"})
  }
})
//delete a product
router.delete("/:id",authenticateToken,async (req,res)=>{
  if (req.user.role != "admin") {
      return res.status(400).json({ message: "You are not an admin" });
    }else{
      const id=req.params.id
      const product=await Product.findById(id)
      if(product){
        await Product.findByIdAndDelete(product);
        res.status(200).json({message:"Delete Product Succesfully!"})
      }
    }
  
  
})

//product Updated
router.put("/:id",authenticateToken, async (req,res)=>{
  try{
 if (req.user.role != "admin") {
      return res.status(400).json({ message: "You are not an admin" });
    }else{
      const id=req.params.id;
      const body=req.body;
      const product=await Product.findByIdAndUpdate(id,body, {new:true});
      if(product){
        res.status(200).json(product)
      }else{
         res.status(400).json({ message: "Product Not Found." });
      }
    }
  }catch{es.status(500).json({message:"Something went worng"})}

})



module.exports = router;