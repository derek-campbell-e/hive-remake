module.exports = function Drone(Hive){
  const debug = require('debug')('base:drone');

  let drone = require('../Bee')(Hive);

  drone.meta.class = 'drone';

  let init = function(){
    debug("bee is now a drone...");
    return drone;
  };

  return init();
};