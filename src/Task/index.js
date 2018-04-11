module.exports = function Task(Module, TaskName){
  //TaskFunction = TaskFunction || function(){};

  const common = require('../Common');
  const debug = require('debug')('task');

  let task = common.object();
  task.meta.class = 'task';
  task.meta.mind = TaskName;
  
  task.meta.runtime = -1;
  task.meta.startedTaskAt = -1;
  task.meta.completedTaskAt = -1;
  task.meta.isRunning = false;
  task.meta.isComplete = false;

  let taskTimer = null;


  task.start = function(){
    task.meta.isRunning = true;
    task.meta.startedTaskAt = common.timestamp();
    task.meta.runtime = 0;
    taskTimer = setInterval(task.updateRuntime);
  };

  task.finish = function(){
    task.meta.isRunning = false;
    taskTimer = clearInterval(taskTimer);
    task.meta.completedTaskAt = common.timestamp();
    task.meta.runtime = parseInt(task.meta.completedTaskAt) - parseInt(task.meta.startedTaskAt);
    task.log(`finished running task that ran for ${task.meta.runtime} ms`);
    task.complete();
  };

  task.updateRuntime = function(){
    task.meta.runtime = parseInt(common.timestamp()) - parseInt(task.meta.startedTaskAt);
  };

  task.complete = function(){
    task.meta.isComplete = true;
    task.emit("task:complete", task.meta.id);
    setTimeout(task.remove, 10000);
  };

  task.remove = function(){
    task.emit('task:remove', task.meta.id);
  };

  task.export = function(){
    //return require('extend')(true, {}, task.meta);
    return task.meta;
  };

  task.gc = function(){
    init = null;
    bind = null;
    task = null;
  };
  
  let init = function(){
    bind();
    return task;
  };

  let bind = function(){

  };

  return init();
};