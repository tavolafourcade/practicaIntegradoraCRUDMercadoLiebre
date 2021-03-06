const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render("products", { products: products, toThousand:toThousand });
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let _id = Number(req.params.id);
		// let product = products[id];
		let product = products.find(({id})=> id === _id)
		res.render('detail', {product: product});
	},

	// Create - Form to create
	create: (req, res) => {
		let id = products.length + 1;
    res.render("product-create-form", {id:id});
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let product = {};
		product.id = products.length + 1;
    product.name = req.body.name;
    product.price = req.body.price;
    product.discount = req.body.discount;
    product.category = req.body.category;
    product.description = req.body.description;
    product.image = req.body.image;
    products.push(product);
    let created = JSON.stringify(products);
    fs.writeFileSync(path.join(__dirname, "../data/productsDataBase.json"), created);
    res.redirect("/");
	},

	// Update - Form to edit
	
	edit: (req, res) => {

		let _id = Number(req.params.id);
		// let productToEdit = products[id];
		let productToEdit = products.find(({id})=> id === _id)
		res.render('product-edit-form', {productToEdit: productToEdit})
		
	},
	// Update - Method to update
	update: (req, res) => {
		let id = parseInt(req.params.id);
    let editProduct = req.body;
    products.forEach(product => {
      if(product.id === id){
        product.name = editProduct.name;
        product.price = editProduct.price;
        product.discount = editProduct.discount;
        product.category = editProduct.category;
        product.description = editProduct.description;
      }   
    });
		let edited = JSON.stringify(products);
    fs.writeFileSync(path.join(__dirname, "../data/productsDataBase.json"), edited);
    res.redirect('/'); 
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let _id = Number(req.params.id);
		// let product = products[id];
		let product = products.find(({id})=> id === _id)
		// res.render('detail', {product: product});

		//Eliminando el id
		products.splice(product,1);
		let newElements = JSON.stringify(products);
		fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), newElements);
		res.redirect('/');

	}
};

module.exports = controller;