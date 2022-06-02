'use strict';
    
const middleware_authenication = require('../middleware/authenication');
const apps_deal_router_userGet = require('../apps/deal/router/userGet');

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
    .then(wrappedHandler(apps_deal_router_userGet.handler.bind(apps_deal_router_userGet)));
};