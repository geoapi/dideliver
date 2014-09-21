var fortune = require('fortune') 
var app = fortune({
db: "./db/restaurant",
baseUrl: "gentle-forest-1449.herokuapp.com"
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
app.listen(process.argv[2] || 5000);
