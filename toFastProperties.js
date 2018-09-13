(function(d) {
    function b(a) {
        if (null !== c && typeof c.property) return a = c, c = b.prototype = null, a;
        c = b.prototype = null == a ? Object.create(null) : a;
        return new b
    }
    var c = null;
    b();
    d.toFastproperties = function(a) {
        return b(a)
    }
})(window);
