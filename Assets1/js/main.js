/*! js-cookie v3.0.0-rc.1 | MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,r=e.Cookies=t();r.noConflict=function(){return e.Cookies=n,r}}())}(this,function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)e[r]=n[r]}return e}var t={read:function(e){return e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};return function n(r,o){function i(t,n,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),n=r.write(n,t);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n+c}}return Object.create({set:i,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var n=document.cookie?document.cookie.split("; "):[],o={},i=0;i<n.length;i++){var c=n[i].split("="),u=c.slice(1).join("=");'"'===u[0]&&(u=u.slice(1,-1));try{var f=t.read(c[0]);if(o[f]=r.read(u,f),e===f)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){i(t,"",e({},n,{expires:-1}))},withAttributes:function(t){return n(this.converter,e({},this.attributes,t))},withConverter:function(t){return n(e({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(r)}})}(t,{path:"/"})});
var Cookie = Cookies.get('Cookies')
                     // Genarate UserID
                    function UserID(length) {
                        var result           = [];
                        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for ( var i = 0; i < length; i++ ) {
                          result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
                       }
                       return result.join('');
                    }
                     // Cookies set
                    var Cookie = Cookies.get('Cookies')
                    var UserIDs = Cookies.get('UserID')
                    if (UserIDs == null) {
                        Cookies.set('UserID', UserID(20))
                        console.log("Current Cookie = cold")
                        location.reload();
                        //alert("- Please Wait.\n- Cookie Needs To Be Made");
                    } else {
                    console.log("Current Cookie = warm")
                    console.log("Current Cookie Token = " + "%c" + Cookies.get("UserID") , "color:blue;")
                    console.log("Current Cookie expires never")
                    console.log("%cDanger Area", "color:red; font-size:80px")
                    console.log("%cDo not Give People Your ID", "color:red; font-size:35px")
                    }

        //
    function GetID() {
        document.getElementById("ids").value = Cookies.get('UserID')
        console.log(Cookies.get('UserID'))
        if (document.getElementById("idurl").value == "Magma.serble.net/Redirect/?ID=") {
            function UID(length) {
                var result           = [];
                var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                  result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
               }
               return result.join('');
            }
        document.getElementById("idurl").value = document.getElementById("idurl").value + UID(5)
        }
    }
    function Enable_cookie() {
        Cookies.set('Cookies', 'true');
        window.location.href = "../"
    }
    function Disable_cookie() {
        Cookies.set('Cookies', 'false');
        window.location.href = "../"
    }
var open = Cookies.get("open")
    if (open == null) {
        Cookies.set("open", "1")
    } else {
        var value = parseInt(open);
        Cookies.set("open", value + 1)
    }
    function PublicUrl() {
        window.location.href = "/website"
    }


    function _Status(_1, _2) {
        document.getElementById("Status").value = _1 + _2
    }
    function DirOpen(_Url) {
        window.location.href = `<!-- #echo var="DIRLIST_FILE_URL" -->`
    }
    function wlh(_Url) {
        window.location.href = _Url
    }
    function item_input(_id, _message) {
        var id = document.getElementById(_id).value
        if (id == "") {
            document.getElementById(_id).value = _message
        }
    }
    function CS(_id, _value) {
        Cookies.set(_id, _value)
    }
    function CSA(_name, _value,  _hr, _min) {
        if (_hr == 0) {
            Cookies.set(_name, _value, {expires: (_min / 1440)})
                } else {
            Cookies.set(_name, _value,  {expires: (_hr / 24) });
            }
        }

    function CG(_id) {
        Cookies.get(_id)
    }
    function DE(_id) {
        var Item = document.getElementById(_id)
        Item.remove()
    }
    function create(_id, _value, _3) {
        function _id(_3) {
            _value
            console.error()
        }
    }
        // Mail
        (function() {emailjs.init("user_fEWnDU4JVatATlF4Qu9PY")})();
        function mail(_1, _2, _3, _4, _5, _6, _7) {
            var Service_id = 'service_l7pv0aa';
            var Form_id = 'template_tnqpcob';
            var Form_params = {
            _I1: _1 + ": " + document.getElementById(_1).value,
            _I2: _2 + ": " + document.getElementById(_2).value,
            _I3: _3 + ": " + document.getElementById(_3).value,
            _I4: _4 + ": " + document.getElementById(_4).value,
            _I5: _5 + ": " + document.getElementById(_5).value,
            _I6: _6 + ": " + document.getElementById(_6).value
        };
        emailjs.send(Service_id,Form_id,Form_params);
        console.log(_7)
          if (_7 !== null) {
            alert(_7)
          }}
