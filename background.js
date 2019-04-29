"use strict";
function onError(error) {
  console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    var examplePort = browser.tabs.connect(
      tab.id,
      {name: "tabs-connect-example"}
    );
    examplePort.onMessage.addListener(function(m) {
      console.log('received message from tab ' + tab.id + ':');
      console.log(m);
      if (m == 'iniciar'){
          var port = browser.runtime.connectNative("clscan"); 
          examplePort.postMessage('iniciado');
       }
    });
    examplePort.postMessage('escanear');
    //var port = browser.runtime.connectNative("clscan"); 
  }
}
browser.browserAction.onClicked.addListener(() => {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(sendMessageToTabs).catch(onError);
});

