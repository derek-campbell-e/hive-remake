module.exports = function TestDrone(){
  let mind = {};

  mind.hz = 10000;
  //mind.maxThreads = 3;

  mind.task = function(callback){
    callback("we are finished");
  };

  return mind;
};