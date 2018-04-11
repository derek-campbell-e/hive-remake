module.exports = function Queen(Hive){
  const debug = require('debug')('queen');
  let queen = require('../Bee')(Hive);
  queen.meta.class = 'queen';

  let minds = {};
  minds.drones = {};
  minds.workers = {};

  let locator = require('./Locator')(minds);
  let spawner = require('./Spawner')(minds);

  locator.locateBees(function(){
    debug("DONE LOCATING", minds);
    spawner.spawnBee('drone', 'test');
  });

  return queen.spawn();
};