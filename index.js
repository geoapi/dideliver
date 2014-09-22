var fortune = require('fortune'), express = fortune.express;
var appmain = express(), port = process.env.PORT || 4000;
var app = fortune({
db: "./db/restaurant",
baseUrl: "http://gentle-forest-1449.herokuapp.com"
});


app.resource('restaurant',{
	username:String,
	password:String, //will check with stormpath and how we can represent it
	title:String,
	contact_person:String,
	email:String,
	phone:String,
	restaurant_type:String,
	address:String,
	menu_r:['menu'],
	r_has_rType:['restaurant_has_restaurantType']
});

//app.resource('restaurant_has_restaurantType',{
//	Restaurant_id:Number,
//	RestaurantType_id:Number
//});


app.resource('RestaurantType',{
	name:String,
	r_has_rType:['restaurant_has_restaurantType']
});

app.resource('restaurant_has_restaurantType',{
   Restaurant_id: Number,
   RestaurantType_id: Number
});

app.resource('menu',{
	title:String,
	price:Number,
	image:String,
	Description:String,
	order1:['order']
});
app.resource('user', {
	username: String,
	firstname: String,
	lastname: String,
	email: String,
	university: String,
	order1:['order']
});
app.resource('order', {
	delivery_address: String,
	delivery_cost: Number,
	cost:Number,
	paid:Number,
	created:String,
	status_code:String
});
//app.get('/', function(request, response) {
 // response.send('Hello World!')
//});
appmain.use(app.router);
appmain.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
  });
appmain.get('/restaurants', function(req,res){
res.send(req.body.text );
});
appmain.listen(port);

console.log('Listening on port ' + port + '...');

