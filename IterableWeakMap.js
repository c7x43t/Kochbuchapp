// Implements a WeakMap than can be iterated and which's keys and values can be accessed as sparse arrays
// upon creation an array of [key,value] pairs may be passed
function IterableWeakMap(array){
	// the WeakMap is stored as a hidden property
	var _WeakMap_=new WeakMap();
	var initIterableWeakMap=false;
	if(array!==void 0){
		if(array instanceof Array){
			initIterableWeakMap=true;
		}else{
			throw new Error("Intialization failed: Optional argument must be an Array.");
		}
	}
	// the values array is iterable by this Iterator trough a for of loop
	this[Symbol.iterator]=function* specialIterator(){
		const keys=Object.keys(this.values);
		for(let i=0;i<keys.length;i++){
			yield this.values[keys[i]];
		}
	}
	// the objectIterator can be used to correctly loop sparse Arrays with a for of loop
	function* objectIterator(){
		const keys=Object.keys(this);
		for(let i=0;i<keys.length;i++){
			yield this[keys[i]];
		}
	}
	// the IterableWeakMap comes with additional properties:
	// length
	// keys and values: sparse arrays holding the keys and values
	// with corresponding keys, values beeing at the same index
	// for set, get and delete read the WeakMap reference as they should behave identical:
	// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
	Object.defineProperties(this, {
		length: {
			value: 0,
			writable: true
		},
		keys:{
			value:[]
		},
		values:{
			value:[]
		},
		set: {
			value: function(key,value){
				var index=_WeakMap_.get(key);
				if(index!==void 0){
					this.values[index]=value;
				}else{
					index=this.keys.push(key)-1;
					this.values.push(value);
					this.length++;
				}
				return _WeakMap_.set(key,index);
			}
		},
		get: {
			value: function(key){
				var index=_WeakMap_.get(key);
				if(index!==void 0){
					return this.values[index];
				}
				return index;
				
			}
		},
		delete: {
			value: function(key){
				var index=_WeakMap_.get(key);
				if(index!==void 0){
					delete this.values[index];
					delete this.keys[index];
					this.length--;
					return _WeakMap_.delete(key);
				}
				return false;
			}
		},
		// map, forEach, filter, reduce work exactly as expected from the Array methods
		// they return a new IterableWeakMap in the case of map and filter
		// arguments of the passed in functions should be (value,key,this)
		// or (acc,value,key,this) in the case of reduce
		// this beeing the IterableWeakMap itself
		// if no acc=initialValue is passed to reduce the first element becomes he initialValue
		// and iteration begins at the second element (same as in Array.reduce)
		map:{
			value: function(f){
				var indices=Object.keys(this.values);
				var newIterableWeakMap=new this.constructor();
				for(var i of indices){
					newIterableWeakMap.set(this.keys[i],f(this.values[i],this.keys[i],this));
				}
				return newIterableWeakMap;
			}
		},
		forEach:{
			value: function(f){
				var indices=Object.keys(this.values);
				for(var i of indices){
					f(this.values[i],this.keys[i],this);
				}
			}
		},
		filter:{
			value: function(f){
				var indices=Object.keys(this.values);
				var newIterableWeakMap=new this.constructor();
				for(var i of indices){
					if(f(this.values[i],this.keys[i],this)) newIterableWeakMap.set(this.keys[i],this.values[i]);
				}
				return newIterableWeakMap;
			}
		},
		reduce:{
			value: function(f,acc){
				var indices=Object.keys(this.values);
				var startIndex=0;
				if(acc===undefined) acc=this.values[indices[startIndex++]];
				for(var i=startIndex;i<indices.length;i++){
					acc=f(acc,this.values[indices[i]],this.keys[indices[i]],this)
				}
				return acc;
			}
		}
	});
	if(initIterableWeakMap){
		var type, index;
		for(var i=0;i<array.length;i++){
			if(array[i] instanceof Array&&array[i].length===2){
				type=typeof array[i][0];
				if(type!=="number"&&type!=="string"){
					index=this.keys.push(array[i][0])-1;
					this.values.push(array[i][1]);
					this.length++;
					_WeakMap_.set(array[i][0],index);
				}else{
					throw new Error("Intialization failed: Numbers and Strings cannot be weakly referenced.");
				}
			}else{
				throw new Error("Intialization failed: Array must consist of [key,value] pairs. Arrays of length 2.");
			}
		}
	}
	// this will correct the behaviour using a for of loop on
	// the sparse arrays
	this.keys[Symbol.iterator]=objectIterator;
	this.values[Symbol.iterator]=objectIterator;
}
