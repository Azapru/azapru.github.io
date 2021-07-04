/*-- Variables --*/
//var site_key stored in hidden
var UserID = Cookies.get("UserID");
var Point = Cookies.get("CheckPoint");
var Dir = document.getElementById("Dir-HTML");
var ReCap = document.getElementById("Recaptcha-HTML");
/*-- Variables --*/

   /* var Recaptcha_Verifyed = function() {
        var wlh = window.location.href
            if (Point !== null) {
                var Current_Point = Number(Point)
                console.log('Verifyed User "' + UserIDs + '"');
                Cookies.set("CheckPoint", Current_Point + 1, {expires: 1})
                if (Point == "0") {
                window.location.href = "https://file-link.net/251127/Mcp1"
               } else if (Point == "1") {
                window.location.href = "https://file-link.net/251127/Mcp2"
              } else if (Point == "2") {
               window.location.href = "https://file-link.net/251127/Mcp3"
              }
            }};*/
    var onloadCallback = function() {
        grecaptcha.render('Recaptcha', { 
        'sitekey' : site_key,
        'callback' :  (CSA('ReCaptcha-timeout', 'true', 0, 1), _callback),
        'theme' : 'dark'
        });
        
    };

    function CheckPoint_Level(_1) {
        var Point = Cookies.get("CheckPoint")
        var Dir = document.getElementById("Dir-HTML")
        var ReCap = document.getElementById("Recaptcha-HTML")
        if (Point == null) {
            Cookies.set("CheckPoint", "0")
            location.reload()
        } /*else if (Point == "1") {
            document.getElementById("Points").value = "CheckPoint 1/3";
            Dir.remove()
        }else if (Point == "2") {
           document.getElementById("Points").value = "CheckPoint 2/3";
           Dir.remove()
        }else if (Point == "0") {
            Dir.remove() 
        } */else {
            ReCap.remove()
        }
    }