  var fbURL = "http://www.facebook.com/";
  var facebook = "http://www.facebook.com/index.php"; //used instead of home page to avoid awkward ajax
  var pollInterval = 1000 * 15;  // 15 seconds
  var requestTimeout = 1000 * 10;  // 10 seconds
  var notificationCount;
  var img_notLoggedInSrc = "not_logged_in";
  var img_noNewSrc = "no-new";
  var img_newSrc = "new";
  var iconSet = "set1";
  var iconFormat = ".gif";
      var xhr;
  var iconState;
      var failCount = 2;
      
  var notificationText = "";
  var notificationCountChanged = false;
      
  function initialize()
  {
    window.setTimeout(startRequest, 0);
  }

  function scheduleRequest() {
    window.setTimeout(startRequest, pollInterval);
  }

  function startRequest() {
    getNotificationCount(
      function(count) {
        updateNotificationCount(count);
        scheduleRequest();
      },
      function() {
        scheduleRequest();
      }
    );
  }
  
  var frame = null; 
  function setIcon(path) {
    path = "icons/" + iconSet + "/" + path + iconFormat;
    var img = new Image();
    img.onerror = function() {
        console.error("Could not load browser action icon '" + path + "'.");
    }
    img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = img.width > 19 ? 19 : img.width;
        canvas.height = img.height > 19 ? 19 : img.height;

        var canvas_context = canvas.getContext('2d');
        canvas_context.clearRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(img, 0, 0, canvas.width, canvas.height);
        var imgData = canvas_context.getImageData(0, 0, canvas.width, canvas.height);
        chrome.browserAction.setIcon({imageData: imgData});
        delete imgData;
    }
    img.src = path;
} 

function getNotificationCount(onSuccess, onError) {
        if(xhr != null) {
                    xhr.onreadystatechange = null;
                    xhr = null;
    }
    xhr = new XMLHttpRequest();
    var abortTimerId = window.setTimeout(function() {
      xhr.abort();
      onError();
    }, requestTimeout);

    function handleSuccess(count) {
      window.clearTimeout(abortTimerId);
      onSuccess(count);
    }

    function handleError() {
              failCount = failCount + 1;
              console.log("Failed, failcount is now " + failCount);
              if (failCount > 2) {
                      setIcon(img_notLoggedInSrc);
                      chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 255]});
                      chrome.browserAction.setBadgeText({text:"X"});
                      chrome.browserAction.setTitle({title:"Not logged in"});
                      window.clearTimeout(abortTimerId);
                      iconState = 3;
                      failCount = 0;
                      console.log("Swapped icon for fail. Reset failCount to 0");
              }
              onError();
    }

    try
    {
      xhr.onreadystatechange = function()
      {
        if (xhr.readyState == 4)
        {
                    
                    var notification_start = xhr.responseText.indexOf('<span id="notificationsCountValue">');
          console.log("ResponseText position is " + notification_start)
          if(notification_start > 0)
          {
            var notification_end = xhr.responseText.indexOf('</span>', notification_start);
            var notifications = xhr.responseText.substring(notification_start,notification_end);

            var count = getdigits(notifications);
            if(count == "")
              count = 0;
            handleSuccess(count);
          }
          else
          {
            handleError();
          }
                      xhr.onreadystatechange = null;
           xhr = null;
        }
      }
              delete notification_start
              delete notification_end
              delete notifications
    }
    catch(e)
    {
      console.log(e);
      handleError();
    }

    xhr.open("GET",facebook,true);
    xhr.send(null);
  }

  function getdigits (s) {
     return s.replace (/[^\d]/g, "");
  }
      
  function updateNotificationCount(count) {
        failCount = 0;
    if(notificationCount != count || iconState == 3)
    {
        console.log("Notifications have changed, resolving..")
        if (count == 0) { 
                console.log("You now have no notifications (updating icon)");
                setIcon(img_noNewSrc);            
                chrome.browserAction.setBadgeBackgroundColor({color:[120, 140, 180, 255]});
                chrome.browserAction.setTitle({title:"No new notifications"});
                chrome.browserAction.setBadgeText({text:""});
                                    iconState = 0;
            } else {
                setIcon(img_newSrc);
                notificationCount = count;
                console.log(count +" notifications found (updating icon)")
                chrome.browserAction.setBadgeBackgroundColor({color:[239, 54, 29, 255]});
                chrome.browserAction.setBadgeText({text:notificationCount});
                chrome.browserAction.setTitle({title:count +" notification(s)"});
                                    iconState = 2;
            }
                            notificationCount = count;
                            
    }
  }
      
  function goToFacebook()
  {
        chrome.tabs.create({url: fbURL});
  }
  
    chrome.browserAction.onClicked.addListener(function(windowId) {
            goToFacebook();
    });
      
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
        if (changeInfo.url && changeInfo.url.indexOf(facebook) == 0) {
            console.log("saw facebook! updating...");
            updateNotificationsCount(count)
        }
    });
