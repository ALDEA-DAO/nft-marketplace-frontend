export function searchKeyInArray (array, key) {
    for (var i=0; i < array.length; i++) {
      if (array[i] === key) {
        return true;
      }
    }
    return false;
  }  


//search key in object 
export function searchKeyInObject (obj, key) {
  if (obj.hasOwnProperty(key)) {
    return true;
  } else {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (key == keys[i]) {
        return true;
      }
    }
    return false;
  }
}

//search and get key in object
export function searchAndGetKeyInObject (obj, key) {
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  } else {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (key == keys[i]) {
        return obj[key];
      }
    }
    return undefined;
  }
}


//----------------------------------------------------------------------

//for printing pretty any object
export function toJson(data: any) {
  if (data){
    return JSON.stringify(data, getCircularReplacer()).replace(/"(-?\d+)n"/g, (_, a) => a)
    //return JSON.stringify(data, getReplacer()).replace(/"(-?\d+)n"/g, (_, a) => a)
    //return JSON.stringify(data, getReplacer()).replace(/"(-?\d+)n"/g, (_, a) => a)
      //return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}n` : v)
         // ;
  }else{
      return ""
  }
}

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return 'Object Circular Reference';
      }
      seen.add(value)
    }
    if (typeof value === 'bigint') {
      return `${value}n`
    }else{
      return value
    }
  }
}



//----------------------------------------------------------------------
