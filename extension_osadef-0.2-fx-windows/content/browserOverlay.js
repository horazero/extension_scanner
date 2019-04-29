/**
 * XULSchoolChrome namespace.
 */
if ("undefined" == typeof(XULSchoolChrome)) {
  var XULSchoolChrome = {};
};
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
/**
 * Controls the browser overlay for the Hello World extension.
 */
 window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    myExtension.init();
},false);
var myExtension = {
    init: function() {
        var appcontent = document.getElementById("appcontent");   // browser
        if(appcontent){
          appcontent.addEventListener("DOMContentLoaded", myExtension.onPageLoad, true);
        }
    },
    onPageLoad: function (aEvent){
        var b = document.getElementById('boton-escanear');
        b.setAttribute("disabled","true");

    }
}
XULSchoolChrome.BrowserOverlay = {
  /**
   * Says 'Hello' to the user.
   */
  desplegar: function(aEvent){
    alert("desplegando");
  },
  escanear : function(aEvent) {
    let stringBundle = document.getElementById("xulschoolhello-string-bundle");
    let message = stringBundle.getString("xulschoolhello.greeting.label");
    var w = content.document.getElementById('windowPadron').parentElement;
    var isHidden = w.style['display'] == 'block' ? false:true;
    var afiliado = content.document.getElementById('hiddenAfiliado');
    if (afiliado == null || afiliado.value == '0' || isHidden){
        alert("Tiene que abrir un afiliado para poder escanear!");
    }else{
        try{
            var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath('C:\\clscan\\ejecutar.bat');
            file.launch();
            if(confirm("Por favor, click en OK, cuando termine el scanneo")){
                Components.utils.import("resource://gre/modules/NetUtil.jsm");
                var output = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
                output.initWithPath('C:\\clscan\\output.pdf');

                NetUtil.asyncFetch(output, function(inputStream, status) {
                  if (!Components.isSuccessCode(status)) {
                    // Handle error!
                    alert("Imposible leer el scanneo")
                    return;
                  }
                  var bstream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
                  bstream.setInputStream(inputStream);
                  var size = bstream.available();
                  var data = bstream.readBytes(size);

                  // The file data is contained within inputStream.
                  // You can read it into a string with
                  ////var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
                  //var encodedData = Base64.encode(data);

                  var encodedData = btoa(data);
                  var xhttp = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
                  xhttp.onload = function(aEvent){
                      alert("Completado");
                      content.window.location.reload();
                  }
                  xhttp.onerror = function(aEvent){
                      alert("Error");
                  }
                  xhttp.open("POST", "http://admin.osadef.org.ar/obrasocial/ajaxHandlers.php", true);
                  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                  xhttp.send("action=upload_document&cuit="+afiliado.value+"&file="+encodeURIComponent(encodedData));
                });
            }else{
                alert("Escaneo abortado!");
            }
        }catch (Exception) {
            alert (Exception);
        }
    }
  }
};
