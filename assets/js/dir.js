const params = new URLSearchParams(window.location.search)
var ID = params.get('ID')
var App = params.get('App')
var Version = params.get('Version')
if ( ID == "Discord") {
    wlh = "https://discord.gg/pD2Ubb2"
}
if ( ID == "Minecraft") {
    wlh = "http://magma.serble.net/minecraft Files/"
}
if (wlh == "http://magma-mc.net/Gain/Computer/") {
    if (CG("Form-Set") == "true") {
        mail(CG('Email'), CG('Description'), CG('UserID'), CG('Open'), CG("CheckPoint"), "Null", "/Computer Perms sent");
        wlh("../../Computer/");
    }
}
    if (window.location.href == "http://magma-mc.net/") {
        if (App == 'Application-win32') {
            if (Version !== _app_version) {
                wlh("Download-Application")
                } else {
                console.log("Application Up-To Data")
            }
        }                wlh("Download-Application")
    } else console.log(window.location.href + "App")
    function Form_check(_Item, _value) {

            if (Cookies.get("ReCaptcha-timeout") == "true") {
                DE(_Item)
                document.getElementById("content-desc").innerHTML = "Please Wait You Are On Submition Timeout, Please Try Later"
                
            } else console.log(Cookies.get("ReCaptcha-timeout"))
    }
    