var db = require('./db'),
    express = db.express, 
    app = express(), 
    port = process.env.PORT || 4000,
    cors = require('cors'),
    rsvp = db.rsvp,
    ddAPI = db.api;

//Allow cors 

app.use(cors());
app.use(ddAPI.router);

//Query to get driver orders
app.get('/driver_orders/:id', function (req, res) {
    ddAPI.adapter.findMany('order', {driver:req.params.id}).then(function(orders) {
        res.json(orders);
    });
});

//Query to search menu items
app.get('/search/menuItems', function(req,res) {
    //If restaurant parameter
    if (req.query.restaurants) {
        ddAPI.adapter.find('restaurant', req.query.restaurants).then(function(restaurant) {
            findMenuItems(restaurant.restaurants[0].links.menuItems, req.query.search, function(items) {
                res.json(items);
            });
        });
    //If restaurant type parameter
    } else if (req.query.types) {
        ddAPI.adapter.find('restaurantType', req.query.types).then(function(types) {
            ids = [];
            types.restaurantTypes.forEach(function(type) {
                ids.concat(type.links.restaurants);
            });
            ddAPI.adapter.findMany('restaurant', ids).then(function(restaurants) {
                menuIds = [];
                restaurants.restaurants.forEach(function(rest) {
                    menuIds.concat(rest.links.menuItems);
                });
                findMenuItems(ids, req.query.search, function(items) {
                    res.json(items);
                }); 
            });
        });
    //Search query
    } else {
        findMenuItems(null, req.query.search, function(items) {
            res.json(items);
        });
    }
});

app.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
});

app.listen(port);

console.log('Listening on port ' + port + '...');

var findMenuItems = function(ids, query, callback) {

    var nameQuery = {'name': new RegExp(query, "i")};
    var descQuery = {'description': new RegExp(query, "i")};
    if (ids) {
        nameQuery.id = {$in : ids};
        descQuery.id = {$in : ids};
    }
    
    var promises = {
        name: ddAPI.adapter.find('menuItems', nameQuery),
        description: ddAPI.adapter.find('menuItems', descQuery)
    };

    rsvp.hash(promises).then(function(results) {
        var nameItems = results.name.menuItems;
        var descItems = results.description.menuItems;
        var items = {};

        nameItems.forEach(function(item) {
            items[item.id] = item;
        });

        descItems.forEach(function(item) {
            items[item.id] = item;
        });

        callback(items);
    });
    
};

