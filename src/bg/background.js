
function FaceStache() {

  var plugin = {
    
    // Used as semaphor for the refresh timer
    _request_processed: true, 

    settings: {
      pollInterval: 30 * 1000,
      url: "https://www.facebook.com/index.php",
      nIcons: 5,
      beard19: "icons/beard.png",
      beard38: "icons/beard38.svg"
    },

    init: function(){
      console.log('init');
      this.getLocalSettings();
      this.browserActions();
      this.initHooks();
      this.scheduleRequest(0);
    },

    initHooks: function(){
      $(window).bind('storage', this.refreshSettings.bind(this) );
    },

    browserActions: function(){
      chrome.browserAction.onClicked.addListener(function(windowId) {
        chrome.tabs.create({url: this.settings.url});
      }.bind(this));              
    },

    getLocalSettings: function(){
      var poll = localStorage["store.settings.selectRefresh"];
      if (poll !== undefined){
        poll = parseInt(poll.replace(/['"]/g,''), 10);
        if (!isNaN(poll)){
          this.settings.pollInterval = poll;
        }
      }  
    },

    refreshSettings: function(){
      this.getLocalSettings();
      window.clearTimeout(this.timer);
      this.scheduleRequest(0);
    },

    scheduleRequest: function(timeout){      
      if(timeout===0){
        this.startRequest();
        return;
      }
      
      if (timeout === null || timeout === undefined || timeout === '') {
        timeout = this.settings.pollInterval;
      }
      
      if (!this._request_processed){
        return;
      }
      this._request_processed = false;

      this.timer = window.setTimeout(this.startRequest.bind(this), timeout);   
    },

    startRequest: function(){
      this._request_processed = true;
      this.getNotificationCount(
        this.getNotificationSuccess, //success handler
        this.requestError // error handler
      );
    },

    requestError: function(){
      console.log("error getting feed data");
      this.setIcon(-1);
      this.scheduleRequest();
    },

    getNotificationCount: function(success, error){
      $.get(this.settings.url, success.bind(this), 'html')
      .fail(error.bind(this));
    },

    getNotificationSuccess: function(data){
      var count = Number( $(data).find("#notificationsCountValue").html() );

      if (isNaN(count)){
        count = -1;
        console.log("Not logged in");
      }
      else{
        console.log("You have " + count + " notification.");
      }

      this.setIcon(count);
      this.scheduleRequest();
    },

    setIcon: function(count){
      count = (count < 0) ? -1 : count;
      count = (count > this.settings.nIcons ? this.settings.nIcons : count);

      var imgpos = count + 1;

      var img19 = new Image();
      var img38 = new Image();
      var imgData19;
      var imgData38;

      img19.onerror = function() {
          console.error("Could not load icon '" + path + "'.");
      };
      img19.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = img19.width; 
          canvas.height = img19.height;

          var canvas_context = canvas.getContext('2d');
          canvas_context.clearRect(0, 0, img19.width, img19.height);
          canvas_context.drawImage(img19, 0 , 0, img19.width, img19.height);
          imgData19 = canvas_context.getImageData( imgpos*canvas.height , 0, 19, 19);        
      };
      img19.src = this.settings.beard19;

      img38.onerror = function() {
          console.error("Could not load icon '" + path + "'.");
      };
      img38.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = img38.width; 
          canvas.height = img38.height;

          var canvas_context = canvas.getContext('2d');
          canvas_context.clearRect(0, 0, img38.width, img38.height);
          canvas_context.drawImage(img38, 0 , 0, img38.width, img38.height);
          var imgData38 = canvas_context.getImageData( imgpos*canvas.height , 0, 38, 38);
          chrome.browserAction.setIcon({imageData: {"19": imgData19, "38": imgData38}});         
      };
      img38.src = this.settings.beard38;
    }
  }; //plugin

  $.extend(this, plugin);
  this.init();

} //FaceTache

var faceTache = new FaceStache();


