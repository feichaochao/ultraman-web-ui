/**
 * Created by ling on 16/11/27.
 */
var util;

(function (util) {
    var CookieHelper = (function(){
        function CookieHelper(){

        }
        CookieHelper.setCookie = function(name,value,expires){
            if(expires){
                var date = new Date();
                date.setDate(date.getDate()+expires);
                document.cookie = name + "=" + encodeURI(value) + ";expires="+date.toUTCString();
            }else{
                document.cookie = name + "=" + encodeURI(value) + ";";
            }
        };

        CookieHelper.getCookie = function (name) {
            var start = document.cookie.indexOf(name + "=");
            if (start != -1) {
                var end = document.cookie.indexOf(";", start);
                if (end == -1) {
                    end = document.cookie.length;
                }
                return decodeURI(document.cookie.substring(start + name.length + 1, end));
            }
            else {
                return "";
            }
        };

        CookieHelper.removeCookie = function (name) {
            var con = this.getCookie(name);
            if (con) {
                this.setCookie(name, "con", -1);
            }
        };
        return CookieHelper;

    })();

    util.CookieHelper = CookieHelper;

})(util || (util = {}));

