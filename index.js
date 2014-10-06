var fortune = require('fortune'), 
    express = fortune.express, 
    app = express(), 
    port = process.env.PORT || 4000,
    cors = require('cors'),
    db = require('./db'),
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


app.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
});

app.listen(port);

console.log('Listening on port ' + port + '...');

