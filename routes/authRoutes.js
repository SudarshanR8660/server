const express = require("express")
const router = express.Router();
const  {userModel} =require( "../models/userModel")

const {registerController,
    loginController,
    updateController} =require('../controllers/userControllers')
    const {getCurrentUserEmail}=require('../controllers/authControllers')

const productController=require('../controllers/productControllers')

    
router.post('/register',registerController)
router.post('/login',loginController)
// router.put('/update',updateController)
// router.put('/update', updateController)


router.get("/current-user-email",getCurrentUserEmail);

router.get("/create-product",productController.createProduct)
// Edit a product
router.put('/:productId', productController.editProduct);

// Delete a product
router.delete('/:productId', productController.deleteProduct);
module.exports = router;

