function objectToMapArray(obj) {
    var result = [];
    for (var i in obj) {
        var o = {};
        if (obj.hasOwnProperty(i)) {
            o.key = i;
            o.value = obj[i];
        }
        result.push(o);
    }
    return result;
}

function mapArrayToObject(mapArray) {
    var result = {};
    for (var i in mapArray) {
        if (mapArray.hasOwnProperty((i))) {
            result[mapArray[i].key] = mapArray[i].value;
        }
    }
    return result;
}

function sortObject(obj, sortFunction) {
    sortFunction = sortFunction || function(a, b) { return a.key > b.key};
    return mapArrayToObject(objectToMapArray(obj).sort(sortFunction));
}

function find(array, closure) {
    var result;
    $.each(array, function(i, v) {
        if (closure(v)) {
            result = v;
            return false;
        }
    });
    return result;
}

function eachItem(arrayOrObject, closure) {
    if (arrayOrObject instanceof Array) {
        $.each(arrayOrObject, function(i, v){closure(v)});
    } else if (arrayOrObject != null) {
        closure(arrayOrObject);
    }
}

function array(arrayOrObject) {
    if (arrayOrObject instanceof Array) {
        return arrayOrObject;
    } else if (arrayOrObject != null) {
        return [arrayOrObject];
    } else {
        return [];
    }
}

function filterArray(array, matcher) {
    var result = [];
    $.each(array, function(i, v){
        if (matcher(v)) {
            result.push(v);
        }
    });
    return result;
}

function countOfSubstrings(string, substring) {
    return string.split(substring).length - 1;
}

function cloneArray(array) {
    return array.slice(0);
}
