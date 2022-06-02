'use strict';
    
const middleware_authenication = require('../middleware/authenication');
const apps_event_router_create = require('../apps/event/router/create');

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
    .then(wrappedHandler(apps_event_router_create.handler.bind(apps_event_router_create)));
};