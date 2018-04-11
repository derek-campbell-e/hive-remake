module.exports = function Schedule(Mind){
  const debug = require('debug')('schedule');
  const common = require('../../Common');
  const Timer = require('./Timer');

  let sched = common.object();
  let timers = {};

  let allTimers = function(callback){
    for(let timerID in timers){
      callback(timers[timerID], timerID);
    }
  };


  sched.fireScheduledEvent = function(timer){
    sched.emit('scheduled-fire', timer);
  };

  sched.determineScheduleType = function(){
    if(Mind.hz){
      debug("we are on a hz schedule");
      let timer = new Timer();
      timer.type = 'hz';
      timer.timer = setInterval(sched.fireScheduledEvent.bind(sched, timer), Mind.hz);
      timer.clearTimer = clearTimeout.bind(timer, timer.timer);
      timers[timer.id] = timer;
    }
  };

  sched.gc = function(){
    allTimers(function(timer){
      timer.clearTimer();
      timers[timer.id] = null;
      delete timers[timer.id];
    });
    timers = null;
    init = null;
  };

  let init = function(){
    debug("creating a new schedule...");
    sched.determineScheduleType();
    return sched;
  };

  return init();
};