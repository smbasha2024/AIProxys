
fetch("config/appconfig.json")
  .then(r => r.json())
  .then(cfg => {
    window.AppConfig = cfg; // global access
    //startApp();
  });