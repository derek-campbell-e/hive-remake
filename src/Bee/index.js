module.exports = function Bee(Hive){
  const debug = require('debug')('base:bee');
  const common = require('../Common');
  
  let bee = common.object();

  bee.meta.class = 'bee';

  let tasks = {};
  let delegates = {};

  bee.spawn = function(){
    Hive.addBeeToCollection(bee);
  };

  bee.retire = function(){
    //debug("WE ARE BEING RETIRED");
    Hive.removeListener('prepare-exit', bee.gc);
    Hive.removeBeeFromCollection(bee);
    bee = null;
    tasks = null;
    delegates = null;
    init = null;
    bind = null;
  };

  bee.gc = function(){
    debug("doing garbage collection");
    bee.retire();
  };

  bee.export = function(){
    return require('extend')(true, {}, bee.meta);
  };

  let bind = function(){
    Hive.on('prepare-exit', bee.gc);
  };

  let init = function(){
    bind();
    //debug("initialized a new bee...");
    //bee.__super__ = require('extend')(true, {}, bee);
    return bee;
  };

  return init();
};