const routes = require("next-routes")();

routes
  .add("/markets/:name", "/markets/show")
  .add("/markets/:name/pendingServices/:address", "/markets/pendingServices")
  .add("/markets/:name/boughtServices/:address", "/markets/boughtServices")

  .add("/markets/:name/newMarket", "/markets/newMarket/new")
  .add("/markets/Labour/newMarket/:address", "/markets/newMarket/showLabour")
  .add(
    "/markets/Labour/newMarket/:address/newService",
    "/markets/newMarket/newService/new"
  );

module.exports = routes;
