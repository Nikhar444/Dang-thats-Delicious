// we use mongoose to interface with our mongoDB 

const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // We can wait for data to come back from database with async await using build-in ES6 promise
// we can use the built-in callbacks, we can use external libraries
// open devTool and type 'Promise' in console
const slug = require('slugs'); // this allows us to mamke url friendly names, its sort of like wordpress permalink

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
  	type: Date,
  	default: Date.now
  },
  location: {
  	type: {
  		type: String,
  		default: 'Point'
  	},
  	coordinates: [{
  		type: Number,
  		required: 'You must supply coordinates!'
  	}],
  	address:{
  		type: String,
  		required: 'You must supply an address!'
  	}
  },
  photo: String
});

// we have used pre-saved hook for mongoDB --> we are going to autogenerate this slug before saving

storeSchema.pre('save', function(next){
	if(!this.isModified()){
		next(); // skip it
		return; // stop the function from running
		// return next(); // we can also do it this way
	}
	this.slug = slug(this.name);
	next();
	// TODO make more resiliant so slugs are unique
});


module.exports = mongoose.model('Store', storeSchema);