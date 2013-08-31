// if you checked "fancy-settings" in extensionizr.com, uncomment this lines


var FaceStache = {

  /*saved_settings: new Store("settings", {*/
    //"sample_setting": "This is how you use Store.js to remember values"
  /*}),*/

  settings: {
    pollInterval: 10 * 1000,
    url: "https://www.facebook.com/index.php"
  },

  init: function(){
    console.log('init');
    this.scheduleRequest(0);
  },

  scheduleRequest: function(timeout){

    if (timeout === null || timeout === undefined || timeout === '') {
      timeout = this.settings.pollInterval;
    }

    window.setTimeout($.proxy(this.startRequest, this), timeout);
       
  },

  startRequest: function(){
    console.log('startRequest');

    this.getNotificationCount(
      this.getNotificationSuccess,
      this.scheduleRequest
    );
  },

  getNotificationSuccess: function(data){
    console.log('getNotificationSuccess');

  },


  getNotificationCount: function(success, error){
    $.get(this.settings.url, success, 'html')
    .fail(error);
  },

};

FaceStache.init();






//example of using a message handler from the inject scripts
/*chrome.extension.onMessage.addListener(*/
  //function(request, sender, sendResponse) {
    //chrome.pageAction.show(sender.tab.id);
    //sendResponse();
/*});*/



