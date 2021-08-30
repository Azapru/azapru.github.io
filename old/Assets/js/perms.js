
function getIP(json) {
    var ip_data = json.ip
    if (json.ip.includes("31.127.160.") == true) {
        CS("ip", "true")
    } else if (json.ip.includes("31.127.160.") == true) {
        CS("ip", "true")
    } else {
        CS("ip", "false")
    }
  }
  function HTML() {
      if (Cookies.get("ip") == "false") {
        var HTML_DATA = document.getElementById("content-desc");
            HTML_DATA.innerHTML = "<p> Sorry But You Do not Have Perms to be here</p> <a onclick='wlh(`../`)'> Click Here To Go Back</a>";

        var HTML_TITLE = document.getElementById("content-title");
            HTML_TITLE.innerHTML = "Permission Needed"

        var HTML_TEXT = document.getElementById("content-desc");
            HTML_TEXT.innerHTML = "<p> Sorry But You Do not Have Perms to be here</p> <a onclick='wlh(`../`)'> Click Here To Go Back</a>\n, <a onclick='wlh(`../Gain/Computer`)'> Click Here To Gain Permission</a> ";
        DE("html")
       }
  }