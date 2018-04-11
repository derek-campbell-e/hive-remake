module.exports = function Hive(Options){

  const defaultOptions = require('./options')();
  global['Options'] = require('extend')(true, {}, defaultOptions, Options);

  const common = require('../Common');
  const debug = require('debug')('hive');

  let hive = common.object();

  hive.meta.version = require('../../package.json').version;
  hive.meta.class = 'hive';

  let cli = require('./CLI')(hive);

  let bees = {};
  let queen = null;


  // private functions
  let allBees = function(callback){
    for(beeID in bees){
      callback(bees[beeID]);
    }
  };

  let beeByID = function(id, callback){
    callback = callback || function(){};
    if(bees.hasOwnProperty(id)){
      callback(bees[id]);
      return bees[id];
    }
    callback(false);
    return false;
  };

  // public functions
  hive.getBees = function(){
    return bees;
  };

  hive.beeByID = function(id){
    if(!bees.hasOwnProperty(id)){
      return false;
    }
    return bees[id];
  };

  hive.addBeeToCollection = function(bee){
    hive.log(`adding bee ${bee.meta.debugName()} to collection`);
    bees[bee.meta.id] = bee;
  };

  hive.removeBeeFromCollection = function(bee){
    hive.log(`removing bee ${bee.meta.debugName()} from collection`);
    bees[bee.meta.id] = null;
    delete bees[bee.meta.id];
  };

  hive.beeSpawn = function(bee){
    hive.log("a bee has spawned...");
    hive.addBeeToCollection(bee);
  };

  let init = function(){
    queen = require('../Queen')(hive);
    return hive;
  };

  return init();
};