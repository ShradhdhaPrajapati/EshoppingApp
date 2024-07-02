const express = require("express")
const router = express.Router()
const User = require("../model/users")
const auth = require("../middleware/auth")
const bcrypt = require("bcryptjs")
const Admin = require("../model/admin")
const jwt = require("jsonwebtoken")
const aauth = require("../middleware/aauth")
// const category = require("../model/categories")
const Category = require("../model/categories")
const Product = require("../model/products")
const multer = require("multer")
const fs = require("fs")
const products = require("../model/products")
const Order = require("../model/order")
const order = require("../model/order")

// for img uploding

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img')
    },
    filename: function (req, file, cb) 
    {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({ storage: storage });



// adminlogin
router.get("/admin",(req,resp)=>{
    resp.render("adminlogin")
})



// dashboard session
router.get("/dashboard",aauth,(req,resp)=>{
    resp.render("dashboard")
})



// admin login session
router.post("/adminlogin",async(req,resp)=>{

    const username = req.body.username
    const password = req.body.password

    try {
        
        const data = await Admin.findOne({username:username})    


        if(password==data.password)
        {
            
            const token = await jwt.sign({_id:data._id},process.env.A_key)
            resp.cookie("ajwt",token)
            resp.redirect("dashboard")
        }
        else{
            resp.render("adminlogin",{"msg":"Invalid credentials"})
        }


    } catch (error) {
        console.log(error);
        resp.render("adminlogin",{"msg":"Invalid credentials"})
    }
})
// adminlogin session end



// adminlogout session start

router.get("/adminlogout",aauth,async(req,resp)=>{
     
  
    resp.clearCookie("ajwt")
    resp.redirect("admin")
})

// adminlogout session end


//category section start

router.get("/category",aauth,async(req,resp)=>{
    try {

        const categories = await Category.find();
        resp.render("category",{"categories":categories})
    } catch (error) {
        
    }
})

router.post("/addcategory",aauth,async(req,resp)=>{
    const id = req.body.id;   
    try {
        const id = req.body.id;
        if(id=="")
            {
                const cat = new Category(req.body)
                await cat.save();                
            }
            else
            {
                await Category.findByIdAndUpdate(id,req.body)
            }
            resp.redirect("category")       
    } catch (error) {
        
    }
})

router.get("/deletecategory",aauth,async(req,resp)=>{
    try {

        const _id = req.query.id;
        await Category.findByIdAndDelete(_id);
        resp.redirect("category");
    } catch (error) {
        
    }
})

router.get("/editcategory",aauth,async(req,resp)=>{
    try {

        const _id = req.query.id;
        catdata =  await Category.findOne({_id:_id});
        const categories = await Category.find();
        resp.render("category",{"categories":categories,"catdata":catdata});
    } catch (error) {
        
    }
})


//category section end




//product section start


// Add product
router.post("/addproduct", aauth, upload.single('img'), async (req, resp) => {
    

    const product = new Product({
        catid : req.body.catname,
        pname : req.body.pname,
        price : req.body.price,
        qty   : req.body.qty,
        image : req.file.filename   
    });

    try {
        await product.save();
        resp.redirect("product");
    } catch (error) {
        console.log(error);
        resp.render("product", { msg: "Error adding product", error });
    }
});



router.get("/product",aauth,async(req,resp)=>{
    
    try {
        const allcat = await Category.find();
        const allproduct = await Product.find().populate('catid')
        resp.render("product", { "categories": allcat, "products": allproduct });
    } catch (error) {
        console.error(error);
    }
})


// Add product
router.post("/addproduct", aauth, upload.single('img'), async (req, resp) => {
    // Your existing code to add a product
});

// Edit product

// router.get("/editproduct",aauth,async(req,resp)=>{
//     try {

//         const _id = req.query.id;
//         prodcutsdata =  await Product.findOne({_id:_id});
//         const products = await Product.find();
//         resp.render("product",{"products":products,"prodcutsdata":prodcutsdata});
//     } catch (error) {
        
//     }
// })





// Edit product
router.get("/editproduct", aauth, async (req, resp) => {
    try {
        const _id = req.query.id;
        const productData = await Product.findOne({_id:_id });
        const allCategories = await Category.find();
        resp.render("product", { categories: allCategories, productData });
    } catch (error) {
        console.log(error);
        resp.render("product", { msg: "Error loading product for editing", error });
    }
});

// Update product
router.post("/updateproduct", aauth, upload.single('img'), async (req, resp) => {
    const { id, catname, pname, price, qty } = req.body;
    const updateData = {
        catid: catname,
        pname,
        price,
        qty,
    };

    if (req.file) {
        updateData.image = req.file.filename;
    }

    try {
        await Product.findByIdAndUpdate(id, updateData);
        resp.redirect("product");
    } catch (error) {
        console.log(error);
        resp.render("product", { msg: "Error updating product", error });
    }
});





//delete product

router.get("/deleteproduct",aauth,async(req,resp)=>{
    try {
        
        const _id =  req.query.id;
        await Product.findByIdAndDelete(_id);
        resp.redirect("product");
    } catch (error) {
        
    }
})
 


//product section end



//order section start

router.get("/order",aauth,async(req,resp)=>{
    try {
        resp.render("order")
    } catch (error) {
        
    }
})


//order section end



//users section start

router.get("/user",aauth,async(req,resp)=>{
    try {
        resp.render("user")
    } catch (error) {
        
    }
})


//user section end



//userorder

router.get("/userorder",aauth,async(req,resp)=>{
    try {

        const order = await Order.find().populate("uid").populate("Product.pid");
        console.log(order);
        resp.render("orders",{"orders":order})
    } catch (error) {
        
    }
})
module.exports = router