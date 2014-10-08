var db = require('./db'),
    Type = require('type-of-is'),
    express = db.express, 
    app = express(), 
    port = process.env.PORT || 4000,
    cors = require('cors'),
    rsvp = db.rsvp,
    ddAPI = db.api;


//Allow cors 
app.use(ddAPI.router);
app.use(cors());

//Query to get driver orders
app.get('/driver_orders/:id', function (req, res) {
    ddAPI.adapter.findMany('order', {driver:req.params.id}).then(function(orders) {
        res.json(orders);
    });
});


app.get('/uni_menu/:id', function(req, res) {

    ddAPI.adapter.find('university', {id:req.params.uni}).then(function(uni) {
        ddAPI.adapter.findMany('restaurant', uni.links.restaurants).then(function(rests) {
            var items = [];
            for (var i = 0; i<rests.length; i++) {
                items = items.concat(rests[i].links.menuItems);
            }
            ddAPI.adapter.findMany('menuItem', items).then(function(menuItems) {
                res.json(menuItems);
            });
        });
    });
});

app.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
});

app.listen(port);

console.log('Listening on port ' + port + '...');



