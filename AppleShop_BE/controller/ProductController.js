

const productService = require('../service/ProductService');

const get = async() =>{
    try{
        const products = await productService.get();
        return products;
    }catch(error){
        console.log(error);
    }
}

const create = async(name, param, image, price, year, categoryId) =>{
    try{
        const product = await productService.create(name, param, image, price, year, categoryId);
        return product;
    }catch(error){
        console.log(error);
    }
}

const remove = async(id) => {
    try{
        await productService.remove(id);
    }catch(error){
        console.log(error);
    }
}

const getOne = async(id) => {
    try{ 
        const product = await productService.getOne(id);
        return product;
        
    }catch(error){
        console.log(error);
    }
}    
  
const update = async (id, name, param, image, price, year, categoryId) => {
    try{
        const product = await productService.update(id, name, param, image, price, year, categoryId);
        return product;
    }catch(error){
        console.log(error);
    }
}


module.exports = { get, create, remove, getOne, update};