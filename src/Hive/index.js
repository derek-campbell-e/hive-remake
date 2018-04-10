module.exports = function Hive(){
  let options = {};
  options.logFolder = './logs';
  global['Options'] = options;

  const common = require('../Common');
  const debug = require('debug')('hive');

  let hive = common.object();
  let bees = {};

  hive.meta.class = 'hive';

  hive.getBees = function(){
    return bees;
  };

  hive.beeByID = function(id){
    if(!bees.hasOwnProperty(id)){
      return false;
    }
    //console.log(bees[id]);
    return bees[id];
  };

  hive.addBeeToCollection = function(bee){
    hive.log(`adding bee ${bee.meta.id} ${bee.meta.class}:${bee.meta.mind} to collection`);
    bees[bee.meta.id] = bee;
  };

  hive.removeBeeFromCollection = function(bee){
    hive.log(`removing bee ${bee.meta.id} ${bee.meta.class}:${bee.meta.mind} from collection`);
    bees[bee.meta.id] = null;
    delete bees[bee.meta.id];
  };

  hive.beeSpawn = function(bee){
    hive.log("a bee has spawned...");
    hive.addBeeToCollection(bee);
  };

  let init = function(){
    return hive;
  };

  return init();
};