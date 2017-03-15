'use strict';

var utils = require('test/utils');

var isDeepEqual = module.exports = function isDeepEqual(actual, expected) {
  var result;
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  }

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  else if (utils.isDate(actual) && utils.isDate(expected)) {
    if (actual.getTime() === expected.getTime()) {
      return true;
    } else {
     console.log("Date not equal", actual, expected, actual.getTime(), expected.getTime());
     return false;
    }
  }

  // XXX specification bug: this should be specified
  else if (utils.isPrimitive(actual) || utils.isPrimitive(expected)) {
    if (expected === actual) {
      return true;
    } else {
       console.log("Primitive not equal", actual, expected);
      return false;
    }
  }

  else if (utils.instanceOf(actual, Error) ||
           utils.instanceOf(expected, Error)) {
    return actual.message === expected.message &&
           actual.type === expected.type &&
           actual.name === expected.name &&
           (actual.constructor && expected.constructor &&
            actual.constructor.name === expected.constructor.name)
  }

  // 7.3. Other pairs that do not both pass typeof value == "object",
  // equivalence is determined by ==.
  else if (!utils.isObject(actual) && !utils.isObject(expected)) {
    if (actual == expected) {
      return true;
    } else {
     console.log("Nom object", actual, expected);
     return false;
    }
  }

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical "prototype" property. Note: this
  // accounts for both named and indexed properties on Arrays.
  else {
    result = actual.prototype === expected.prototype &&
           isEquivalent(actual, expected);
      if (result) {
        return true;
      } else {
        console.log("Proto not qual", actual.prototype === expected.prototype, isEquivalent(actual, expected));
       return false;
      }
  }
}

function isEquivalent(a, b, stack) {
  return isArrayEquivalent(Object.keys(a).sort(),
                           Object.keys(b).sort()) &&
          Object.keys(a).every(function(key) {
            return isDeepEqual(a[key], b[key], stack)
          });
}

function isArrayEquivalent(a, b, stack) {
  return utils.isArray(a) && utils.isArray(b) && a.length === b.length &&
         a.every(function(value, index) {
           return isDeepEqual(value, b[index]);
         });
}
