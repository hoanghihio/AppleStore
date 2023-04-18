
const productModel = require('../model/ProductModel');

const get = async () => {
    //select * form products
    const products = await productModel.find({}).populate('categoryId', '_id name');
    return products;
}


const getOne = async (id) => {
    //select * form products where id  = id
    const product = await productModel.findById(id).populate('categoryId', '_id name'); //Object
    //const product =await productModel.findone({_id: id, name:'Iphone12'}); //object
    // const product = await productModel.find({}).populate('categoryId', '_id name');

    return product;
    
}

const create = async (name, param, image, price, year, categoryId) => {
        //insert into products (name, price, image, description, category_id) 
        //values (name, price, image, description, category_id)
        const model = new productModel({name, param, image, price, year, categoryId});
        await model.save();     
        return model;
}

const update = async (id, name, param, image, price, year, categoryId ) =>{
    //update products set name = name, price = price, image = image, description = description categoryId
    //where id = id
    const product = await productModel.findById(id);
    const model = await productModel.findByIdAndUpdate(id,
        {name, param, image: image ? image: product.image, price, year, categoryId});
        return model;
}

const remove = async (id) => {
    //delete from products where id = id
    await productModel.deleteOne({_id: id});
}




module.exports = { get, create, remove, getOne, update };