"use strict";
document.body.style.border = "5px solid red";


browser.runtime.onMessage.addListener(request => {
  console.log("Message from the background script:");
  var w = document.getElementById('windowPadron').parentElement;
  var isHidden = w.style['display'] == 'block' ? false:true;
  var afiliado = document.getElementById('hiddenAfiliado');
  var { Cc } = require("chrome")
  var file = Cc["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath('C:\\clscan\\ejecutar.bat');
    file.launch();
  if (afiliado == null || afiliado.value == '0' || isHidden){
      alert("Tiene que abrir un afiliado para poder escanear!");
  }
  return Promise.resolve({response: "Hi from content script"});
});
