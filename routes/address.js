







// // const express = require('express');
// // const router = express.Router();
// // const Address = require('../models/Address');

// // POST route to save or update address
// // router.post('/', async (req, res) => {
// //   try {
// //     const { userId, ...addressData } = req.body;

// //     // Ensure userId is provided
// //     if (!userId) {
// //       return res.status(400).json({ error: 'userId is required' });
// //     }

// //     // Check if an address already exists for the userId
// //     const existingAddress = await Address.findOne({ userId });

// //     // If an address already exists, update it
// //     if (existingAddress) {
// //       Object.assign(existingAddress, addressData);
// //       await existingAddress.save();
// //       return res.status(200).json({ message: 'Address updated successfully', address: existingAddress });
// //     }

// //     // If the address doesn't exist, create a new one
// //     const address = new Address({ userId, ...addressData });
// //     await address.save();

// //     res.status(201).json({ message: 'Address saved successfully', address });
// //   } catch (error) {
// //     if (error.code === 11000) {
// //       // Duplicate key error
// //       return res.status(400).json({ error: 'Duplicate address' });
// //     }
// //     console.error('Error saving address:', error);
// //     res.status(500).json({ error: 'Error saving address' });
// //   }
// // });

// // // GET route to fetch addresses by userId
// // router.get('/:userId', async (req, res) => {
// //   try {
// //     const userId = req.params.userId;
// //     const userAddresses = await Address.find({ userId });
// //     res.json(userAddresses);
// //   } catch (error) {
// //     console.error('Error fetching addresses:', error);
// //     res.status(500).json({ error: 'Error fetching addresses' });
// //   }
// // });

// // // DELETE route to delete address by id
// // router.delete('/:id', async (req, res) => {
// //   try {
// //     const addressId = req.params.id;

// //     // Find the address by ID and delete it
// //     const deletedAddress = await Address.findByIdAndDelete(addressId);

// //     if (!deletedAddress) {
// //       // If address not found, send 404 status
// //       return res.status(404).json({ error: 'Address not found' });
// //     }

// //     // Send success response
// //     res.json({ message: 'Address deleted successfully', deletedAddress });
// //   } catch (error) {
// //     // Handle errors
// //     console.error('Error deleting address:', error);
// //     res.status(500).json({ error: 'Error deleting address' });
// //   }


// //   // POST route to save or update billing address
// // router.post('/billing', async (req, res) => {
// //   try {
// //     const { userId, ...billingAddressData } = req.body;

// //     // Ensure userId is provided
// //     if (!userId) {
// //       return res.status(400).json({ error: 'userId is required' });
// //     }

// //     // Check if a billing address already exists for the userId
// //     const existingBillingAddress = await Address.findOne({ userId, type: 'billing' });

// //     // If a billing address already exists, update it
// //     if (existingBillingAddress) {
// //       Object.assign(existingBillingAddress, billingAddressData);
// //       await existingBillingAddress.save();
// //       return res.status(200).json({ message: 'Billing address updated successfully', address: existingBillingAddress });
// //     }

// //     // If the billing address doesn't exist, create a new one
// //     const billingAddress = new Address({ userId, ...billingAddressData, type: 'billing' });
// //     await billingAddress.save();

// //     res.status(201).json({ message: 'Billing address saved successfully', address: billingAddress });
// //   } catch (error) {
// //     if (error.code === 11000) {
// //       // Duplicate key error
// //       return res.status(400).json({ error: 'Duplicate billing address' });
// //     }
// //     console.error('Error saving billing address:', error);
// //     res.status(500).json({ error: 'Error saving billing address' });
// //   }
// // });

// // });




// // module.exports = router;





// const express = require('express');
// const router = express.Router();
// const Address = require('../models/Address');

// // POST route to save shipping or billing address
// router.post('/', async (req, res) => {
//   try {
//     // Extract data from request body
//     const { userId, addressType, ...addressData } = req.body;

//     // Validate required fields
//     if (!userId || !addressType) {
//       return res.status(400).json({ error: 'userId and addressType are required' });
//     }

//     // Create or update address based on addressType
//     let existingAddress = await Address.findOne({ userId, addressType });

//     if (existingAddress) {
//       // Update existing address
//       existingAddress = await Address.findOneAndUpdate(
//         { userId, addressType },
//         { $set: addressData },
//         { new: true }
//       );
//       return res.status(200).json({ message: `${addressType} address updated successfully`, address: existingAddress });
//     } else {
//       // Create new address
//       const newAddress = new Address({ userId, addressType, ...addressData });
//       await newAddress.save();
//       return res.status(201).json({ message: `${addressType} address saved successfully`, address: newAddress });
//     }
//   } catch (error) {
//     console.error('Error saving address:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// router.get('/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const addresses = await Address.find({ userId });
//     return res.status(200).json({ addresses });
//   } catch (error) {
//     console.error('Error fetching addresses:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// })

// module.exports = router;

const express = require('express');
const router = express.Router();
const Address = require('../models/Address');

router.post('/', async (req, res) => {
  try {
    // Extract data from request body
    const { userId, addressType, ...addressData } = req.body;

    // Validate required fields
    if (!userId || !addressType) {
      return res.status(400).json({ error: 'userId and addressType are required' });
    }

    // Create or update address based on addressType
    let existingAddress = await Address.findOne({ userId, addressType });

    if (existingAddress) {
      // Update existing address
      existingAddress = await Address.findOneAndUpdate(
        { userId, addressType },
        { $set: addressData },
        { new: true }
      );
      return res.status(200).json({ message: `${addressType} address updated successfully`, address: existingAddress });
    } else {
      // Create new address
      const newAddress = new Address({ userId, addressType, ...addressData });
      await newAddress.save();
      return res.status(201).json({ message: `${addressType} address saved successfully`, address: newAddress });
    }
  } catch (error) {
    console.error('Error saving address:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to fetch addresses by userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const addresses = await Address.find({ userId });
    return res.status(200).json({ addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;