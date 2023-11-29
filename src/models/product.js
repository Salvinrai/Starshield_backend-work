const mongoose = require('mongoose');
const productSchema = new  mongoose.Schema({
  productid: {
    type: String,
    required: true,
  },
  productname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
//   category: {
//     type: String,
//     required: true,
//   },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  attribute :{
    color :{
        type: String,
    },
    size :{
        type:String,
        enum: ['None', 'Small', 'Medium', 'Large'],
        default: 'None',
    }
  },
  image: {
    type: String,
  },
  productTag : {
    type: String,
    enum: ['Popular','New','Most'],
    default: 'Popular',
  },
  
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});


module.exports.product = model('Product', productSchema);