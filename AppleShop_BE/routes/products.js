var express = require('express');
var router = express.Router();

const ProductController = require('../controller/ProductController');
const CategoryController = require('../controller/CategoryController');
const middleware = require('../middleware/upload');
const getConstant = require('../utlis/constanst').getConstant;
const paypal = require('paypal-rest-sdk');


/** chạy trên web
 * Hiển thị trang danh sách sản phẩm 
 * http://localhost:3000/san-pham/  */
// router.get('/', async function(req, res, next){
//     let products = await ProductController.get();
//     products = products.map((p, index) => {
//       const price=  p.price.toLocaleString('vi', {style : 'currency', currency : 'VND'});
//       return {
//         _id: p._id,
//         name: p.name,
//         param: p.param,
//         image: p.image,
//         price: price,
//         year: p.year,
//         categoryId: p.categoryId,
//         index: index + 1,
//       }
//     });
//     console.log(products); 
//     res.render('products/san-pham', { sp:products });
//    // res.status(200).json(products);
// }); 

// /**
//  * xóa sản phẩm
//  */
// //http://localhost:3000:/san-pham/:id
// router.delete('/:id', async function (req, res, next){
//   try{
//     let { id } = req.params;
//     await ProductController.remove(id);
//     res.json({ status: true });
//   }catch(error){
//     res.json ({ status: false });
//   }
// });

// /**
//  * Hiển thị trang chi tiết sản phẩm 
//  * http://localhost:3000/:id/detail
//  */
// router.get('/:id/detail', async function(req, res, next) {
//   try{
//     let { id } = req.params;
//     const product = await ProductController.getOne(id);
//     let categories = await CategoryController.get();
//     categories = categories.map((p, index) => {
//       return {
//           _id: p._id,
//           name: p.name,
//           isSelected: p._id.toString() == product.categoryId._id.toString(),
//       }
//     });
//     res.render('products/chinh-sua', { product, categories });
//       //res.status(200).json({ product, categories });
//   }catch(error){
//     next(error);
//   }
// });

// /**
//  * Hiển thị cập nhật sản phẩm
//  * https://localhost:3000/san-pham/:id/detail
//  */
//  router.post('/:id/detail', [middleware.single('image'), ], async function(req, res, next) {
//   try{
//     let { file } = req;
//     let { name, param, image, price, year, categoryId  } = req.body;
//     let { id } = req.params;
//     image = file ? file.filename : '';
//     image = image ? `${getConstant().HOST}/images/${image}`: '';
//     await ProductController.update(id, name, param, image, price, year, categoryId  );
//     res.redirect('/san-pham');
//     // res.status(200).json(products);
//   }catch(error){  
//     console.log(error);
//     next(error);
//   }
// });


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AW1aSiGIC14SjUesBwIYKYhFkrjn3zpEOeh62sGyEOiCRmOFoniDjS4NuDRVlurvq6fOpTgt99Vkvzl7',
  'client_secret': 'EOMs137gGXTWWhRFMlKWMGVPbkvO403tUAuYr00P14YP3GIBariDUbtifyvgfZOZgL_2RvfCUTmpPz0K',
});

/* https://localhost:3000/san-pham/paypal */
router.get('/paypal', function (req, res, next) {
  var create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": `${getConstant().HOST}/san-pham/success`,
      "cancel_url": `${getConstant().HOST}/san-pham/cancel`
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "item",
          "sku": "item",
          "price": "1.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": "1.00"
      },
      "description": "This is the payment description."
    }]
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      console.log("Create Payment Response");
      console.log(payment);
      res.redirect(payment.links[1].href);
    }
  });
});

router.get('/success', function (req, res, next) {
  var PayerID = req.query.PayerID;
  var paymentId = req.query.paymentId;
  var execute_payment_json = {
    payer_id: PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "1.00"
        }
      }
    ]
  };
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment ) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      console.log("Get Payment Response");
      console.log(JSON.stringify(payment));
      res.render('success');
    }
  });
});

router.get('/cancel', function (req, res, next) {
  res.send('cancel');
});
/* GET home page. */
/*Hiển thị trang tạo mới sản phẩm*/
//http://localhost:3000/san-pham/tao-moi
router.get('/tao-moi', async function(req, res, next) {
  const categories = await CategoryController.get();
  res.render('products/tao-moi', {categories});
});

/**
 * Lưu tạo mới sản phẩm
 * http://localhost:3000/san-pham/chinh-sua
 */
router.post('/tao-moi', [middleware.single('image'), ], async function(req, res, next) {
 try{
  let { file } = req; 
  let { name, param, image, price, year, categoryId } = req.body;
  image = file ? file.filename : '';
   image = image ? `${getConstant().HOST}/images/${image}`: '';
  await ProductController.create( name, param, image, price, year, categoryId );
  res.redirect('/san-pham');
 }catch(error){
  console.log(error); 
    next(error);
 }
});


/*Gọi API Mobile */

/** 
 * Hiển thị trang danh sách sản phẩm 
 * http://localhost:3000/san-pham/  
 */
router.get('/', async function(req, res, next){
  let products = await ProductController.get();
  // Lọc sản phẩm theo danh mục nếu có thông tin danh mục
  products = products.map((p, index) => {
    const price = p.price.toLocaleString('vi', {style : 'currency', currency : 'VND'});
    return {
      _id: p._id,
      name: p.name,
      param: p.param,
      image: p.image,
      price: price,
      year: p.year,
      categoryId: p.categoryId,
      index: index + 1,
    }
  });
  console.log(products); 
  res.status(200).json(products);
});


/* xóa sản phẩm */
//http://localhost:3000:/san-pham/:id
router.delete('/:id', async function (req, res, next){
try{
  let { id } = req.params;
  await ProductController.remove(id);
  res.json({ status: true });
}catch(error){
  res.json ({ status: false });
}
});

/**
* Hiển thị trang chi tiết sản phẩm 
* http://localhost:3000/:id/detail
*/
router.get('/:id/detail', async function(req, res, next) {
try{
  let { id } = req.params;
  const product = await ProductController.getOne(id);
  let categories = await CategoryController.get();
  categories = categories.map((p, index) => {
    return {
        _id: p._id,
        name: p.name,
        isSelected: p._id.toString() == product.categoryId._id.toString(),
    }
  });
  // res.render('products/chinh-sua', { product, categories });
    res.status(200).json({ product, categories });
}catch(error){
  next(error);
}
});


/**
* Hiển thị cập nhật sản phẩm
* https://localhost:3000/san-pham/:id/detail
*/
router.post('/:id/detail', [middleware.single('image'), ], async function(req, res, next) {
try{
  let { file } = req;
  let { name, param, image, price, year, categoryId  } = req.body;
  let { id } = req.params;
  image = file ? file.filename : '';
  image = image ? `${getConstant().HOST}/images/${image}`: '';
  await ProductController.update(id, name, param, image, price, year, categoryId  );
  // res.redirect('/san-pham');
  res.status(200).json(products);
}catch(error){  
  console.log(error);
  next(error);
}
});


module.exports = router;
