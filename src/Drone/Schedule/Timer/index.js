module.exports = function Timer(){
  const uuid = require('../../../Common').uuid;
  
  let timer = {};
  timer.type = "";
  timer.id = uuid();
  timer.timer = null;
  timer.clearTimer = function(){};

  return timer;
};