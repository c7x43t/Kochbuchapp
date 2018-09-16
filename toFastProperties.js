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
// Make Objects iterable [for of]
Object.prototype[Symbol.iterator]=function* objectIterator(){
	const keys=Object.keys(this);
	for(let i=0;i<keys.length;i++){
        yield keys[i];
    }
}
