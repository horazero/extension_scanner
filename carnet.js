"use strict";
document.body.style.border = "5px solid red";




browser.runtime.onConnect.addListener(function(port) {
  console.log('Connected to content script!');
  port.onMessage.addListener(function(m) {
    console.log('Received message:');
    console.log(m);
    if (m=='escanear'){
        var mensaje = "Debe seleccionar un afiliado para poder escanear.";
        var w = document.getElementById('windowPadron');
        if (w == null){
            alert(mensaje);
            return;
        }
        
        w = w.parentElement;
        var isHidden = w.style['display'] == 'block' ? false:true;
        var afiliado = document.getElementById('hiddenAfiliado');
        
        if (afiliado == null || afiliado.value == "0" || isHidden){
            alert(mensaje);
            return;
        }
        port.postMessage('iniciar');
    }
    if (m=='iniciado'){
        if(confirm("Por favor, click en OK, cuando termine el scanneo")){
            fetch("http://admin.osadef.org.ar/obrasocial/ajaxHandlers.php");
        }
    }
  });
  document.getElementById('windowPadron').addEventListener('click', function(e) {
    port.postMessage('User clicked on a ' + e.target.tagName);
  }, true)
});

/*
browser.runtime.onMessage.addListener(request => {
  var mensaje = "Debe seleccionar un afiliado para poder escanear.";
  var w = document.getElementById('windowPadron');
  if (w == null){
    alert(mensaje);
    return;
  }
  
  w = w.parentElement;
  var isHidden = w.style['display'] == 'block' ? false:true;
  var afiliado = document.getElementById('hiddenAfiliado');
 
  if (afiliado == null || afiliado.value == "0" || isHidden){
    alert(mensaje);
    return;
  }
  return Promise.resolve({response: "Hi from content script"});
});
*/
