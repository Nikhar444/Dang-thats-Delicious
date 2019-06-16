const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
// router.get('/', (req, res) => {
//   const sachin = { name: 'Sachin Jangid', age: 100, cool: true };
//   // res.send('Hey! It works!');
//   // res.json(sachin);
  
//   // type url --> http://localhost:7777/?name=sachin&age=100
//   // res.send(req.query.name);
//   // res.send(req.query);
//   // res.render('hello');  rendering the hello.pug file
//   res.render('hello', {
//   	name: 'Sachin',
//   	dog: req.query.dog,
//   	title: 'I love food'
//   });
// });

// router.get('/', storeController.homePage);

// router.get('/', storeController.myMiddleWare, storeController.homePage);

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', 
	storeController.upload,
	catchErrors(storeController.resize), 
	catchErrors(storeController.createStore)
);
router.post('/add/:id',
	storeController.upload,
	catchErrors(storeController.resize),
	catchErrors(storeController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

// router.get('/reverse/:name', (req, res) => {
// 	// res.send(req.params.name);
// 	const reverse = [...req.params.name].reverse().join('');
// 	res.send(reverse);
// });

module.exports = router;
