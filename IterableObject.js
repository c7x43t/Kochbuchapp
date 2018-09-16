// Make Objects iterable [for of]
Object.prototype[Symbol.iterator]=function* objectIterator(){
	const keys=Object.keys(this);
	for(let i=0;i<keys.length;i++){
        yield keys[i];
    }
}
