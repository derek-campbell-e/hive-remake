module.exports = function Options(){
  const processArgs = require('vorpal')().parse(process.argv, {use: 'minimist'});

  let options = {};
  options.port = process.env.PORT || 4202;
  options.loadAllDrones = false;
  options.beeFolder = "./bees";
  options.logFolder = "./logs";
  options.startDronesOnLoad = true;
  options.loadDrones = [];
  options.startDrones = [];
  options.maxTaskRuntime = 60 * 1000;
  options.verbose = processArgs['show-logs'] || false;

  return options;
};