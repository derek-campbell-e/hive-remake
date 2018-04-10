let Hive = require('./src/Hive')();
//let Bee = require('./src/Bee')();
for(i = 0; i < 500; i++){
  require('./src/Drone')(Hive).spawn();
}

var convertToMB = function(data){
  return Math.round((data / 1024 / 1024) * 100) / 100;
};

setInterval(function(){
  let mem = process.memoryUsage();
  console.log(convertToMB(mem.rss), convertToMB(mem.heapTotal), convertToMB(mem.heapUsed), convertToMB(mem.external));
}, 1000);


setInterval(function(){
  let bees = Object.keys(Hive.getBees());
  let beeKey = bees.shift();
  let bee = Hive.beeByID(beeKey);
  if(bee){
    bee.retire();
  }
}, 50);

setTimeout(function(){
  Hive.emit('prepare-exit');
}, 5000);


//console.log(Hive);