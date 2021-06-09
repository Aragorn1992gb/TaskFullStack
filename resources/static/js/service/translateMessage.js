// Use this service in order to generate a message translated

app.service("translateMessage", function (Lang,TRANSLATION_ENGLISH,TRANSLATION_CRYPTO) {
    this.translate = function(msg) {
        var language = Lang.getlang();
        return eval("TRANSLATION_"+language.toUpperCase()+"."+msg);    
    }  
});
