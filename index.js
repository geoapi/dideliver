var fortune = require('fortune'), express = fortune.express;
var container = express(), port = process.env.PORT || 4000;
var ddAPI = fortune({
    db: './db/restaurant',
    baseUrl: 'http://gentle-forest-1449.herokuapp.com'
});


//TODO comments

//TODO add authentication


ddAPI.resource('restaurant',{
    name:String,
    manager: 'user',
    email:String,
    phone:String,
    restaurantTypes: ['restaurantType'],
    address:String,
    menuItems: ['menuItem']
    orders : ['order']
});


ddAPI.resource('restaurantType', {
    name:String,
    restaurants: ['restaurant']
});


ddAPI.resource('menuItem', {
    name:String,
    price:Number,
    image:String,
    Description:String,
    restaurant: 'restaurant'
});


ddAPI.resource('user', {
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    university: String,
    restaurant: 'restaurant', 
    ordersMade: [{ref:'order', inverse:'customer'}],
    ordersToDeliver: [{ref:'order', inverse:'driver'}],
    userType: 'userType'
});


ddAPI.resource('userType', {
    name:String,
});


//TODO assign driver on creation
ddAPI.resource('order', {
    restaurant:'restaurant',
    menuItems:['menuItem'],
    customer:{ref:'user', inverse:'ordersMade'},
    driver:{ref:'user', inverse:'ordersToDeliver'},
    delivery_address: String,
    delivery_cost: Number,
    cost:Number,
    created:Date,
    statusCode:String
});


//TODO add socketIO for order updates

//TODO Create custom queries


container.use(ddAPI.router);
container.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
});

container.get('/restaurants', function(req,res){
    res.send(req.body.text );
});


container.get('/drivers', function(req,res){
    res.send(req.body.text);
});

container.listen(port);

console.log('Listening on port ' + port + '...');

