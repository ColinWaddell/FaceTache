// if you checked "fancy-settings" in extensionizr.com, uncomment this lines


function FaceStache() {

  /*saved_settings: new Store("settings", {*/
    //"sample_setting": "This is how you use Store.js to remember values"
  /*}),*/

  plugin = {

    settings: {
      pollInterval: 30 * 1000,
      url: "https://www.facebook.com/index.php",
      nIcons: 5,
      beard: "icons/beard.png"
    },

    init: function(){
      console.log('init');
      this.browserActions();
      this.scheduleRequest(0);
    },

    browserActions: function(){
      chrome.browserAction.onClicked.addListener(function(windowId) {
        chrome.tabs.create({url: this.settings.url});
      }.bind(this));              
    },

    scheduleRequest: function(timeout){
      if (timeout === null || timeout === undefined || timeout === '') {
        timeout = this.settings.pollInterval;
      }

      window.setTimeout(this.startRequest.bind(this), timeout);   
    },

    startRequest: function(){
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
        console.log("You have " + count + " notification." );
      }

      this.setIcon(count);
      this.scheduleRequest();
    },

    setIcon: function(count){
      count = (count < 0) ? -1 : count;
      count = (count > this.settings.nIcons ? this.settings.nIcons : count);

      var imgpos = count + 1;

      var img = new Image();
      img.count = count;

      img.onerror = function() {
          console.error("Could not load icon '" + path + "'.");
      };
      img.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = img.width; 
          canvas.height = img.height;

          var canvas_context = canvas.getContext('2d');
          canvas_context.clearRect(0, 0, img.width, img.height);
          canvas_context.drawImage(img, 0 , 0, img.width, img.height);
          var imgData = canvas_context.getImageData( imgpos*canvas.height , 0, 19, 19);
          chrome.browserAction.setIcon({imageData: imgData});
      };
      img.src = this.settings.beard;
    }
  }; //plugin

  $.extend(this, plugin);
  this.init();
}

var faceTache = new FaceStache();



//example of using a message handler from the inject scripts
/*chrome.extension.onMessage.addListener(*/
  //function(request, sender, sendResponse) {
    //chrome.pageAction.show(sender.tab.id);
    //sendResponse();
/*});*/



