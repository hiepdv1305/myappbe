'use strict';
    
const middleware_authenication = require('../middleware/authenication');
const apps_deal_router_createDeal = require('../apps/deal/router/createDeal');

module.exports.handler = async (event, context) => {
  let end = false;
  context.end = () => end = true;

  const wrappedHandler = handler => prev => {
    if (end) return prev;
    context.prev = prev;
    return handler(event, context);
  };

  return Promise.resolve()
    .then(wrappedHandler(middleware_authenication.isAuth.bind(middleware_authenication)))
    .then(wrappedHandler(apps_deal_router_createDeal.handler.bind(apps_deal_router_createDeal)));
};