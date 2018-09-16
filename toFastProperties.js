// https://github.com/sindresorhus/to-fast-properties/blob/master/index.js
(function toFastProperties(context) {
    let fastProto = null;
    function FastObject(o) {
        if (fastProto !== null && typeof fastProto.property) {
            const result = fastProto;
            fastProto = FastObject.prototype = null;
            return result;
        }
        fastProto = FastObject.prototype = o == null ? Object.create(null) : o;
        return new FastObject;
    }
    FastObject();
    context.toFastproperties = function() {
        return FastObject(this);
    };
})(Object.prototype);

