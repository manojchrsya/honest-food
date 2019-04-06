const router = require('express').Router();
const restaurants = require('./api/restaurants');

router.get('/', async function(req, res, next) {
  const response = {data: {}};  
  if (req.query && req.query.address) {
    const address = req.query.address.replace(/”|“|ß/g, '');
    const result = await restaurants.search({ address }) || {};
    if (result && result.properties) {
      response.data = result.properties;
    }
  }
  return res.render('index', response);
});

module.exports = router;
