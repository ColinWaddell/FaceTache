// SAMPLE
this.manifest = {
  "name": "FaceTache",
  "icon": "../../icons/icon48.png",
  "settings": [
  {
    "tab": "Options",
    "group": "Refresh",
    "name": "selectRefresh",
    "type": "popupButton",
    "label": "Check Facebook every:",
    "options": {
      "values": [
        {
          "value": 30000,
          "text": "30 Seconds",
        },
        {
          "value": 60000,
          "text": "1 Minute",
        },
        {
          "value": 120000,
          "text": "2 Minutes",
        },
        {
          "value": 300000,
          "text": "5 Minutes",
        },
        {
          "value": 600000,
          "text": "10 Minutes",
        },
      ],
    },
  },

  ]
};
