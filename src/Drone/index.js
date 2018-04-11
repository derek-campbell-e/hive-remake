module.exports = function Drone(Hive){
  const debug = require('debug')('base:drone');

  let drone = require('../Bee')(Hive);
  let mind = null;
  let schedule = null;

  drone.meta.class = 'drone';
  drone.meta.hasStarted = false;

  // private drone functions
  let mindLoader = function(){
    const path = require('path');
    mind = null;
    let mindFile = '../../bees/test';
    delete require.cache[require.resolve(mindFile)];
    let mindRequire = require('../../bees/test');
    let _mind = mindRequire;
    if(typeof mindRequire === "function"){
      _mind = mindRequire();
    }
    drone.meta.mind = path.basename(mindFile, '.js');
    mind = _mind;
  };

  let createSchedule = function(){
    if(schedule !== null){
      schedule.gc();
      schedule = null;
    }
    schedule = require('./Schedule')(mind);
    schedule.on('scheduled-fire', runTask);
  };

  let runTask = function(scheduledTimer){
    if(mind.maxThreads && drone.numberOfTasks() >= mind.maxThreads) {
      drone.log("we have reached the maxThreads...");
      return false;
    }

    let taskID = drone.createTask('droneTask');
    drone.task(taskID, function(task){
      task.start();
      mind.task.call(droneExport(task), taskComplete.bind(this, taskID));
    });
  };

  let fireDrone = function(callback){
    let taskID = drone.createTask('drone:fire');
    drone.task(taskID, function(task){
      if(task){
        task.start();
        mind.task.call(droneExport(task), function(...results){
          task.finish();
          callback.apply(callback, results);
          drone.result.apply(drone, results);
        });
      }
    });
    return taskID;
  };

  let droneExport = function(task){
    let exports = drone.export();
    exports.task = task.export();
    return exports;
  };

  let taskComplete = function(taskID, ...results){
    drone.task(taskID, function(task){
      if(task){
        task.finish();
      }
    });
    drone.result.apply(drone, results);
  };

  // public drone functions 
  drone.gc = function(){
    schedule.gc();
    schedule = null;
    mind = null;
    bind = null;
    init = null;
    taskComplete = null;
    runTask = null;
  };

  drone.fire = function(callback){
    return fireDrone(callback);
  };

  drone.reload = function(){
    debug("RELOADING DRONE");
    drone.log("reloading drone with latest version...");
    mindLoader();
    if(drone.meta.hasStarted){
      createSchedule();
    }
  };

  drone.start = function(){
    drone.meta.hasStarted = true;
    createSchedule();
  };

  // initializers
  let bind = function(){
    createSchedule();
  };

  let init = function(){
    debug("bee is now a drone...");
    mindLoader();
    //bind();
    return drone;
  };

  return init();
};