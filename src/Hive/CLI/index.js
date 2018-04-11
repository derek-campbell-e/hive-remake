module.exports = function CLI(Hive){
  const vorpal = require('vorpal')();
  const delegates = require('./delegates')(Hive);

  vorpal.delimiter(`hive:${Hive.meta.version}$`).show();

  vorpal
    .command("bees")
    .action(delegates.showBees);
  
  vorpal
    .command("top")
    .action(function(args, callback){
      callback("top");
    });

  return vorpal;
};