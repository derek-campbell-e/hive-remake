module.exports = function Bee(Hive){
  const debug = require('debug')('base:bee');
  const common = require('../Common');
  
  let bee = common.object();

  bee.meta.class = 'bee';

  bee.stats = {};
  bee.stats.taskCycles = [];

  let tasks = {};
  let delegates = {};

  let allTasks = function(callback){
    for(let taskID in tasks){
      callback(tasks[taskID]);
    }
  };

  let taskByID = function(id, callback){
    callback = callback || function(){};
    if(tasks.hasOwnProperty(id)){
      callback(tasks[id]);
      return tasks[id];
    }
    callback(false);
    return false;
  };

  bee.spawn = function(){
    bee.meta.spawnAt = common.timestamp();
    Hive.addBeeToCollection(bee);
    return bee;
  };

  bee.retire = function(){
    bee.gc();
    Hive.removeListener('prepare-exit', bee.gc);
    Hive.removeBeeFromCollection(bee);
    bee = null;
    tasks = {};
    delegates = null;
    init = null;
    bind = null;
  };

  bee.gc = function(){
    debug("doing garbage collection");
    //bee.retire();
  };

  bee.createTask = function(taskName){
    let task = require('../Task')(bee, taskName);
    tasks[task.meta.id] = task;
    task.on('task:remove', bee.removeTask);
    task.on('task:complete', bee.trackTask);
    bee.log(`created task ${task.meta.debugName()}`);
    return task.meta.id;
  };

  bee.task = function(taskID, callback){
    return taskByID(taskID, callback);
  };

  bee.trackTask = function(taskID){
    bee.task(taskID, function(task){
      bee.stats.taskCycles.push({
        timestamp: common.timestamp(),
        task: task.meta.debugName()
      });
    });
  };

  bee.removeTask = function(taskID){
    return taskByID(taskID, function(task){
      tasks[taskID] = null;
      delete tasks[taskID];
    });
  };

  bee.numberOfTasks = function(){
    let numberOfTasks = 0;
    allTasks(function(task){
      if(task.meta.isRunning || !task.meta.isComplete) {
        numberOfTasks ++;
      }
    });
    return numberOfTasks;
  };

  bee.export = function(){
    return require('extend')(true, {}, bee.meta);
  };

  let bind = function(){
    Hive.on('prepare-exit', bee.gc);
  };

  let init = function(){
    bind();
    //let _super = require('extend')(true, {}, bee);
    //bee.__super__ = {};
    //bee.__super__.gc = bee.gc;
    return bee;
  };

  return init();
};