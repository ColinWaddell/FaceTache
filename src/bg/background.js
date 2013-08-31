// if you checked "fancy-settings" in extensionizr.com, uncomment this lines


var FaceStache = {

  /*saved_settings: new Store("settings", {*/
    //"sample_setting": "This is how you use Store.js to remember values"
  /*}),*/

  settings: {
    pollInterval: 10 * 1000,
    url: "https://www.facebook.com/index.php",
    nIcons: 5
  },

  init: function(){
    console.log('init');
    this.scheduleRequest(0);
  },

  scheduleRequest: function(timeout){

    if (timeout === null || timeout === undefined || timeout === '') {
      timeout = this.settings.pollInterval;
    }

    window.setTimeout(this.startRequest.bind(this), timeout);
       
  },

  startRequest: function(){
    this.getNotificationCount(
      this.getNotificationSuccess,
      this.scheduleRequest
    );
  },

  getNotificationCount: function(success, error){
    $.get(this.settings.url, 
          success.bind(this), 
          'html')
    .fail(error);
  },

  getNotificationSuccess: function(data){
    var count = $(data).find("#notificationsCountValue").html();
    console.log("You have " + count + " notification." );
    
    count = (count > this.settings.nIcons ? this.settings.nIcons : count);

    path = "icons/beard_" + count + ".png";

    var img = new Image();
    img.onerror = function() {
        console.error("Could not load icon '" + path + "'.");
    };
    img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = img.width > 19 ? 19 : img.width;
        canvas.height = img.height > 19 ? 19 : img.height;

        var canvas_context = canvas.getContext('2d');
        canvas_context.clearRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(img, 0, 0, canvas.width, canvas.height);
        var imgData = canvas_context.getImageData(0, 0, canvas.width, canvas.height);
        chrome.browserAction.setIcon({imageData: imgData});
    };
    img.src = path;
 
    this.scheduleRequest();
  }

};

FaceStache.init();






//example of using a message handler from the inject scripts
/*chrome.extension.onMessage.addListener(*/
  //function(request, sender, sendResponse) {
    //chrome.pageAction.show(sender.tab.id);
    //sendResponse();
/*});*/



