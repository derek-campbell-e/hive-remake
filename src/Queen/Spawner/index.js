module.exports = function Spawner(Minds){
  const debug = require('debug')('queen:spawner');
  debug('starting spawner...');

  let spawner = {};
  
  spawner.spawnBee = function(beeClass, beeMind){
    let mindRefKey = null;
    let requirePath = null;

    switch(beeClass){
      case 'drone':
        mindRefKey = 'drones';
        requirePath = '../../Drone';
      break;
      case 'worker':
        mindRefKey = 'workers';
        requirePath = '../../Worker';
      break;
    }

    let useableMindKey = null;

    for(let mindKey in Minds[mindRefKey]){
      if(mindKey.toLowerCase() === beeMind.toLowerCase()){
        useableMindKey = mindKey;
        break;
      }
    }

    if(!useableMindKey){
      debug(`no mind '${beeMind}' exists for bee class '${mindRefKey}'`);
      return false;
    }
    return;
  };

  spawner.spawnDrone = function(droneMind){
    return spawner.spawnBee('drone', droneMind);
  };

  spawner.spawnWorker = function(workerMind){
    return spawner.spawnBee('worker', workerMind);
  };



  return spawner;
};