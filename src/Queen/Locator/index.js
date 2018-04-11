module.exports = function Locator(Minds){
  const debug = require('debug')('queen:locator');
  const path = require('path');
  const glob = require('multi-glob').glob;
  let workerPath = path.join(Options.beeFolder, 'workers');
  let dronePath = path.join(Options.beeFolder, 'drones');
  let searchGlob = ['*/', '*.js'];

  let globOptions = {};
  globOptions.absolute = true;
  globOptions.realpath = true;

  debug(workerPath, dronePath);

  let locator = {};

  locator.addToMind = function(beeClass, callback, error, files){
    let filesCopy = [...files];
    let loop = function(){
      let file = filesCopy.shift();
      if(typeof file === "undefined"){
        return callback();
      }
      let beeMindName = path.basename(file, '.js');
      let mindObject = {};
      mindObject.meta = {};
      mindObject.meta.mind = beeMindName;
      mindObject.meta.path = file;
      Minds[beeClass][beeMindName] = mindObject;
      loop();
    };
    loop();
  };
  
  locator.locateWorkers = function(callback){
    globOptions.cwd = workerPath;
    glob(searchGlob, globOptions, locator.addToMind.bind(locator, 'workers', callback));
  };

  locator.locateDrones = function(callback){
    globOptions.cwd = dronePath;
    glob(searchGlob, globOptions, locator.addToMind.bind(locator, 'drones', callback));
  };

  locator.locateBees = function(completionCallback){
    completionCallback = completionCallback || function(){};
    locator.locateDrones(function(){
      locator.locateWorkers(completionCallback);
    });
  };

  return locator;
};