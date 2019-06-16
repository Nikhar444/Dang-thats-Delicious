const mongoose = require('mongoose');
const Store = mongoose.model('Store'); // getting the modelled storeSchema from Store.js
const multer = require('multer'); // it handles all of those field that are being passed 
const jimp = require('jimp'); // it will allow us to resize our photo
const uuid = require('uuid'); // it will allow us to make the file name unique --> many users can name the photo same


const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/'); // if virus.exe file is renames with extension then it can check even that
		if(isPhoto){
			next(null, true); // this is a callback promise, we have been using async await for promises
			// the first value is error, and the second value you're passing in is what needs to get passed 
			// if we pass null as second parameter that means it worked
		} else {
			next({ message: 'That filetype isn\'t allowed!' }, false);
		}
	}
}

// exports.myMiddleWare = (req, res, next) => {
// 	req.name = 'Sachin';
// 	// res.cookie('name', 'Sachin is cool', { maxAge: 2220 });  // look at application in dev tools
	
// 	// if(req.name === 'Sachin'){  // http://localhost:7777
// 	// 	throw Error('That is a stupid name');
// 	// }
// 	next();
// }

exports.homePage = (req, res) => {
	// console.log(req.name); // Sachin
	// req.flash('error', 'Something Happened');
	// req.flash('error', 'Another <strong>thing</strong> happened');
	// req.falsh('error', 'OOh NO.....');
	// req.flash('info', 'Something Happened');
	// req.flash('warning', 'Something Happened');
	// req.flash('success', 'Something Happened');
	res.render('index');
};

exports.addStore = (req, res) => {
	res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo'); // we just want single field that's called a photo

exports.resize = async (req, res, next) => {
	// check if there's no new file to resize
	if( !req.file ){
		next(); // skip to the next middleware
	}
	// console.log(req.file);
	const extension = req.file.mimetype.split('/')[1];
	req.body.photo = `${uuid.v4()}.${extension}`;
	const photo = await jimp.read(req.file.buffer);
	await photo.resize(800, jimp.AUTO); // width is going to be 800 and height -> AUTO
	await photo.write(`./public/uploads/${req.body.photo}`);
	// once we have written the photo to our filesystem, keep going!
	next();
}

exports.createStore = async (req, res) => {
	// console.log(req.body);
	// res.json(req.body); // send all of the data immediately back to the user that we sent using the form
	
	// const store = new Store(req.body);
	// await store.save();
	const store = await (new Store(req.body)).save();
	req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
	res.redirect(`/store/${store.slug}`);

	// store.age = 10;
	// store.cool = true;
	// store.save(function(err, store){
	// 	if(!err){
	// 		console.log('It worked!');
	// 		res.redirect('/');
	// 	}
	// }); // in order to store age, cool etc in mongoDB we have to save the store, then it will return to us either with error or save. It takes some time to extxute this.
	
	// store 
	// 	.save()
	// 	.then(store => {
	// 		// res.json(store);
	// 		return Store.find()
	// 	})
	// 	.then(stores => {
	// 		res.render('storeList', { stores: stores }) // we can do 'then' as long as these will return some sort of Promise
	// 	})
	// 	.catch(err => {
	// 		throw Error(err);
	// 	});
	// console.log('It worked!');
};

exports.getStores = async (req, res) => {
	// 1. Query the database for a list of all stores
	const stores = await Store.find();
	// console.log(stores);
	res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
	// 1. Find the store given the ID
	// res.json(req.params); // params is something in the req which is come through the url
	const store = await Store.findOne({ _id: req.params.id });
	// res.json(store);

	// 2. Confirm they are the owner of the store
	
	// 3. Render out the edit form so the user can edit their store
	res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
	// set the location data to be a point 
	req.body.location.point = 'Point'; // if we update an address then MongoDB will not have the `type: 'Point'`
	// find and update the store
	const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, // return the new store instead of the old one
		runValidators: true
	}).exec();
	req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`);
	
	// redirect them to the store and tell them it worked
	res.redirect(`/stores/${store._id}/edit`);
}