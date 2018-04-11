module.exports = function CLIDelegates(Hive){
  let delegates = {};

  delegates.showBees = function(args, callback){
    callback("HAHA");
  };

  return delegates;
};