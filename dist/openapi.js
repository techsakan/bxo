// @bun
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// node_modules/zod/v4/core/core.js
var NEVER = Object.freeze({
  status: "aborted"
});
function $constructor(name, initializer, params) {
  function init(inst, def) {
    var _a;
    Object.defineProperty(inst, "_zod", {
      value: inst._zod ?? {},
      enumerable: false
    });
    (_a = inst._zod).traits ?? (_a.traits = new Set);
    inst._zod.traits.add(name);
    initializer(inst, def);
    for (const k in _.prototype) {
      if (!(k in inst))
        Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
    }
    inst._zod.constr = _;
    inst._zod.def = def;
  }
  const Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a;
    const inst = params?.Parent ? new Definition : this;
    init(inst, def);
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
var $brand = Symbol("zod_brand");

class $ZodAsyncError extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
}

class $ZodEncodeError extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
var globalConfig = {};
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
// node_modules/zod/v4/core/util.js
var exports_util = {};
__export(exports_util, {
  unwrapMessage: () => unwrapMessage,
  uint8ArrayToHex: () => uint8ArrayToHex,
  uint8ArrayToBase64url: () => uint8ArrayToBase64url,
  uint8ArrayToBase64: () => uint8ArrayToBase64,
  stringifyPrimitive: () => stringifyPrimitive,
  shallowClone: () => shallowClone,
  safeExtend: () => safeExtend,
  required: () => required,
  randomString: () => randomString,
  propertyKeyTypes: () => propertyKeyTypes,
  promiseAllObject: () => promiseAllObject,
  primitiveTypes: () => primitiveTypes,
  prefixIssues: () => prefixIssues,
  pick: () => pick,
  partial: () => partial,
  optionalKeys: () => optionalKeys,
  omit: () => omit,
  objectClone: () => objectClone,
  numKeys: () => numKeys,
  nullish: () => nullish,
  normalizeParams: () => normalizeParams,
  mergeDefs: () => mergeDefs,
  merge: () => merge,
  jsonStringifyReplacer: () => jsonStringifyReplacer,
  joinValues: () => joinValues,
  issue: () => issue,
  isPlainObject: () => isPlainObject,
  isObject: () => isObject,
  hexToUint8Array: () => hexToUint8Array,
  getSizableOrigin: () => getSizableOrigin,
  getParsedType: () => getParsedType,
  getLengthableOrigin: () => getLengthableOrigin,
  getEnumValues: () => getEnumValues,
  getElementAtPath: () => getElementAtPath,
  floatSafeRemainder: () => floatSafeRemainder,
  finalizeIssue: () => finalizeIssue,
  extend: () => extend,
  escapeRegex: () => escapeRegex,
  esc: () => esc,
  defineLazy: () => defineLazy,
  createTransparentProxy: () => createTransparentProxy,
  cloneDef: () => cloneDef,
  clone: () => clone,
  cleanRegex: () => cleanRegex,
  cleanEnum: () => cleanEnum,
  captureStackTrace: () => captureStackTrace,
  cached: () => cached,
  base64urlToUint8Array: () => base64urlToUint8Array,
  base64ToUint8Array: () => base64ToUint8Array,
  assignProp: () => assignProp,
  assertNotEqual: () => assertNotEqual,
  assertNever: () => assertNever,
  assertIs: () => assertIs,
  assertEqual: () => assertEqual,
  assert: () => assert,
  allowsEval: () => allowsEval,
  aborted: () => aborted,
  NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
  Class: () => Class,
  BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES
});
function assertEqual(val) {
  return val;
}
function assertNotEqual(val) {
  return val;
}
function assertIs(_arg) {
}
function assertNever(_x) {
  throw new Error;
}
function assert(_) {
}
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function joinValues(array, separator = "|") {
  return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function cached(getter) {
  const set = false;
  return {
    get value() {
      if (!set) {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
      throw new Error("cached value already set");
    }
  };
}
function nullish(input) {
  return input === null || input === undefined;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepString = step.toString();
  let stepDecCount = (stepString.split(".")[1] || "").length;
  if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
    const match = stepString.match(/\d?e-(\d?)/);
    if (match?.[1]) {
      stepDecCount = Number.parseInt(match[1]);
    }
  }
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var EVALUATING = Symbol("evaluating");
function defineLazy(object, key, getter) {
  let value = undefined;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING) {
        return;
      }
      if (value === undefined) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
      });
    },
    configurable: true
  });
}
function objectClone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function cloneDef(schema) {
  return mergeDefs(schema._zod.def);
}
function getElementAtPath(obj, path) {
  if (!path)
    return obj;
  return path.reduce((acc, key) => acc?.[key], obj);
}
function promiseAllObject(promisesObj) {
  const keys = Object.keys(promisesObj);
  const promises = keys.map((key) => promisesObj[key]);
  return Promise.all(promises).then((results) => {
    const resolvedObj = {};
    for (let i = 0;i < keys.length; i++) {
      resolvedObj[keys[i]] = results[i];
    }
    return resolvedObj;
  });
}
function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0;i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
function esc(str) {
  return JSON.stringify(str);
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = cached(() => {
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === undefined)
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  return o;
}
function numKeys(data) {
  let keyCount = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keyCount++;
    }
  }
  return keyCount;
}
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return "promise";
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return "map";
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return "set";
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return "date";
      }
      if (typeof File !== "undefined" && data instanceof File) {
        return "file";
      }
      return "object";
    default:
      throw new Error(`Unknown data type: ${t}`);
  }
};
var propertyKeyTypes = new Set(["string", "number", "symbol"]);
var primitiveTypes = new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== undefined) {
    if (params?.error !== undefined)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function createTransparentProxy(getter) {
  let target;
  return new Proxy({}, {
    get(_, prop, receiver) {
      target ?? (target = getter());
      return Reflect.get(target, prop, receiver);
    },
    set(_, prop, value, receiver) {
      target ?? (target = getter());
      return Reflect.set(target, prop, value, receiver);
    },
    has(_, prop) {
      target ?? (target = getter());
      return Reflect.has(target, prop);
    },
    deleteProperty(_, prop) {
      target ?? (target = getter());
      return Reflect.deleteProperty(target, prop);
    },
    ownKeys(_) {
      target ?? (target = getter());
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(_, prop) {
      target ?? (target = getter());
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    defineProperty(_, prop, descriptor) {
      target ?? (target = getter());
      return Reflect.defineProperty(target, prop, descriptor);
    }
  });
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
var BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = {};
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = { ...schema._zod.def.shape };
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error("Object schemas containing refinements cannot be extended. Use `.safeExtend()` instead.");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    checks: []
  });
  return clone(schema, def);
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  const def = {
    ...schema._zod.def,
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    checks: schema._zod.def.checks
  };
  return clone(schema, def);
}
function merge(a, b) {
  const def = mergeDefs(a._zod.def, {
    get shape() {
      const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: []
  });
  return clone(a, def);
}
function partial(Class, schema, mask) {
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone(schema, def);
}
function required(Class, schema, mask) {
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone(schema, def);
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a;
    (_a = iss).path ?? (_a.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config2) {
  const full = { ...iss, path: iss.path ?? [] };
  if (!iss.message) {
    const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
    full.message = message;
  }
  delete full.inst;
  delete full.continue;
  if (!ctx?.reportInput) {
    delete full.input;
  }
  return full;
}
function getSizableOrigin(input) {
  if (input instanceof Set)
    return "set";
  if (input instanceof Map)
    return "map";
  if (input instanceof File)
    return "file";
  return "unknown";
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
function cleanEnum(obj) {
  return Object.entries(obj).filter(([k, _]) => {
    return Number.isNaN(Number.parseInt(k, 10));
  }).map((el) => el[1]);
}
function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0;i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
function uint8ArrayToBase64(bytes) {
  let binaryString = "";
  for (let i = 0;i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}
function base64urlToUint8Array(base64url) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - base64.length % 4) % 4);
  return base64ToUint8Array(base64 + padding);
}
function uint8ArrayToBase64url(bytes) {
  return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function hexToUint8Array(hex) {
  const cleanHex = hex.replace(/^0x/, "");
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0;i < cleanHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}
function uint8ArrayToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

class Class {
  constructor(..._args) {
  }
}

// node_modules/zod/v4/core/errors.js
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, _mapper) {
  const mapper = _mapper || function(issue2) {
    return issue2.message;
  };
  const fieldErrors = { _errors: [] };
  const processError = (error2) => {
    for (const issue2 of error2.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues });
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues });
      } else if (issue2.path.length === 0) {
        fieldErrors._errors.push(mapper(issue2));
      } else {
        let curr = fieldErrors;
        let i = 0;
        while (i < issue2.path.length) {
          const el = issue2.path[i];
          const terminal = i === issue2.path.length - 1;
          if (!terminal) {
            curr[el] = curr[el] || { _errors: [] };
          } else {
            curr[el] = curr[el] || { _errors: [] };
            curr[el]._errors.push(mapper(issue2));
          }
          curr = curr[el];
          i++;
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}

// node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
};
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
var _encode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
};
var _decode = (_Err) => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
};
var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
};
var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};
// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst2._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst2._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.minimum = def.length;
    bag.maximum = def.length;
    bag.length = def.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
class Doc {
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split(`
`).filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x) => `  ${x}`)];
    return new F(...args, lines.join(`
`));
  }
}

// node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 1,
  patch: 5
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst);
  }
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks2, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks2) {
        if (ch._zod.def.when) {
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError;
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary2) => {
            return handleCanaryResult(canary2, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return result.then((result2) => runChecks(result2, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  inst["~standard"] = {
    validate: (value) => {
      try {
        const r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0;i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (result.value === undefined) {
    if (key in input) {
      final.value[key] = undefined;
    }
  } else {
    final.value[key] = result.value;
  }
}
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  for (const k of keys) {
    if (!def.shape[k]._zod.traits.has("$ZodType")) {
      throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  for (const key of Object.keys(input)) {
    if (keySet.has(key))
      continue;
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input)));
    } else {
      handlePropertyResult(r, payload, key, input);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const _normalized = cached(() => normalizeDef(def));
  defineLazy(inst._zod, "propValues", () => {
    const shape = def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = new Set);
        for (const v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = {};
    const proms = [];
    const shape = value.shape;
    for (const key of value.keys) {
      const el = shape[key];
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input)));
      } else {
        handlePropertyResult(r, payload, key, input);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const generateFastpass = (shape) => {
    const doc = new Doc(["shape", "payload", "ctx"]);
    const normalized = _normalized.value;
    const parseStr = (key) => {
      const k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    };
    doc.write(`const input = payload.value;`);
    const ids = Object.create(null);
    let counter = 0;
    for (const key of normalized.keys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(`const newResult = {}`);
    for (const key of normalized.keys) {
      const id = ids[key];
      const k = esc(key);
      doc.write(`const ${id} = ${parseStr(key)};`);
      doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
      `);
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    const fn = doc.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  };
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return;
  });
  const single = def.options.length === 1;
  const first = def.options[0]._zod.run;
  inst._zod.parse = (payload, ctx) => {
    if (single) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleUnionResults(results2, payload, inst, ctx);
    });
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left2, right2]) => {
        return handleIntersectionResults(payload, left2, right2);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  if (left.issues.length) {
    result.issues.push(...left.issues);
  }
  if (right.issues.length) {
    result.issues.push(...right.issues);
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output2) => {
        payload.value = output2;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError;
    }
    payload.value = _out;
    return payload;
  };
});
function handleOptionalResult(result, input) {
  if (result.issues.length && input === undefined) {
    return { issues: [], value: undefined };
  }
  return result;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, payload.value));
      return handleOptionalResult(result, payload.value);
    }
    if (payload.value === undefined) {
      return payload;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
  });
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleDefaultResult(result2, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === undefined) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => {
    const v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleNonOptionalResult(result2, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === undefined) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => {
        payload.value = result2.value;
        if (result2.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
    }
    return payload;
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handlePipeResult(right2, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left2) => handlePipeResult(left2, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r2) => handleRefineResult(r2, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
// node_modules/zod/v4/locales/en.js
var parsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "NaN" : "number";
    }
    case "object": {
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
        return data.constructor.name;
      }
    }
  }
  return t;
};
var error = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const Nouns = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type":
        return `Invalid input: expected ${issue2.expected}, received ${parsedType(issue2.input)}`;
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${Nouns[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue2.origin}`;
      case "invalid_union":
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue2.origin}`;
      default:
        return `Invalid input`;
    }
  };
};
function en_default() {
  return {
    localeError: error()
  };
}
// node_modules/zod/v4/core/registries.js
var $output = Symbol("ZodOutput");
var $input = Symbol("ZodInput");

class $ZodRegistry {
  constructor() {
    this._map = new Map;
    this._idmap = new Map;
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      if (this._idmap.has(meta.id)) {
        throw new Error(`ID ${meta.id} already exists in the registry`);
      }
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = new Map;
    this._idmap = new Map;
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : undefined;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry;
}
var globalRegistry = /* @__PURE__ */ registry();
// node_modules/zod/v4/core/api.js
function _unknown(Class2) {
  return new Class2({
    type: "unknown"
  });
}
function _never(Class2, params) {
  return new Class2({
    type: "never",
    ...normalizeParams(params)
  });
}
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
function _array(Class2, element, params) {
  return new Class2({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
function _refine(Class2, fn, _params) {
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
function _superRefine(fn) {
  const ch = _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  });
  return ch;
}
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
// node_modules/zod/v4/core/to-json-schema.js
class JSONSchemaGenerator {
  constructor(params) {
    this.counter = 0;
    this.metadataRegistry = params?.metadata ?? globalRegistry;
    this.target = params?.target ?? "draft-2020-12";
    this.unrepresentable = params?.unrepresentable ?? "throw";
    this.override = params?.override ?? (() => {
    });
    this.io = params?.io ?? "output";
    this.seen = new Map;
  }
  process(schema, _params = { path: [], schemaPath: [] }) {
    var _a;
    const def = schema._zod.def;
    const formatMap = {
      guid: "uuid",
      url: "uri",
      datetime: "date-time",
      json_string: "json-string",
      regex: ""
    };
    const seen = this.seen.get(schema);
    if (seen) {
      seen.count++;
      const isCycle = _params.schemaPath.includes(schema);
      if (isCycle) {
        seen.cycle = _params.path;
      }
      return seen.schema;
    }
    const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
    this.seen.set(schema, result);
    const overrideSchema = schema._zod.toJSONSchema?.();
    if (overrideSchema) {
      result.schema = overrideSchema;
    } else {
      const params = {
        ..._params,
        schemaPath: [..._params.schemaPath, schema],
        path: _params.path
      };
      const parent = schema._zod.parent;
      if (parent) {
        result.ref = parent;
        this.process(parent, params);
        this.seen.get(parent).isParent = true;
      } else {
        const _json = result.schema;
        switch (def.type) {
          case "string": {
            const json = _json;
            json.type = "string";
            const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minLength = minimum;
            if (typeof maximum === "number")
              json.maxLength = maximum;
            if (format) {
              json.format = formatMap[format] ?? format;
              if (json.format === "")
                delete json.format;
            }
            if (contentEncoding)
              json.contentEncoding = contentEncoding;
            if (patterns && patterns.size > 0) {
              const regexes = [...patterns];
              if (regexes.length === 1)
                json.pattern = regexes[0].source;
              else if (regexes.length > 1) {
                result.schema.allOf = [
                  ...regexes.map((regex) => ({
                    ...this.target === "draft-7" || this.target === "draft-4" || this.target === "openapi-3.0" ? { type: "string" } : {},
                    pattern: regex.source
                  }))
                ];
              }
            }
            break;
          }
          case "number": {
            const json = _json;
            const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
            if (typeof format === "string" && format.includes("int"))
              json.type = "integer";
            else
              json.type = "number";
            if (typeof exclusiveMinimum === "number") {
              if (this.target === "draft-4" || this.target === "openapi-3.0") {
                json.minimum = exclusiveMinimum;
                json.exclusiveMinimum = true;
              } else {
                json.exclusiveMinimum = exclusiveMinimum;
              }
            }
            if (typeof minimum === "number") {
              json.minimum = minimum;
              if (typeof exclusiveMinimum === "number" && this.target !== "draft-4") {
                if (exclusiveMinimum >= minimum)
                  delete json.minimum;
                else
                  delete json.exclusiveMinimum;
              }
            }
            if (typeof exclusiveMaximum === "number") {
              if (this.target === "draft-4" || this.target === "openapi-3.0") {
                json.maximum = exclusiveMaximum;
                json.exclusiveMaximum = true;
              } else {
                json.exclusiveMaximum = exclusiveMaximum;
              }
            }
            if (typeof maximum === "number") {
              json.maximum = maximum;
              if (typeof exclusiveMaximum === "number" && this.target !== "draft-4") {
                if (exclusiveMaximum <= maximum)
                  delete json.maximum;
                else
                  delete json.exclusiveMaximum;
              }
            }
            if (typeof multipleOf === "number")
              json.multipleOf = multipleOf;
            break;
          }
          case "boolean": {
            const json = _json;
            json.type = "boolean";
            break;
          }
          case "bigint": {
            if (this.unrepresentable === "throw") {
              throw new Error("BigInt cannot be represented in JSON Schema");
            }
            break;
          }
          case "symbol": {
            if (this.unrepresentable === "throw") {
              throw new Error("Symbols cannot be represented in JSON Schema");
            }
            break;
          }
          case "null": {
            if (this.target === "openapi-3.0") {
              _json.type = "string";
              _json.nullable = true;
              _json.enum = [null];
            } else
              _json.type = "null";
            break;
          }
          case "any": {
            break;
          }
          case "unknown": {
            break;
          }
          case "undefined": {
            if (this.unrepresentable === "throw") {
              throw new Error("Undefined cannot be represented in JSON Schema");
            }
            break;
          }
          case "void": {
            if (this.unrepresentable === "throw") {
              throw new Error("Void cannot be represented in JSON Schema");
            }
            break;
          }
          case "never": {
            _json.not = {};
            break;
          }
          case "date": {
            if (this.unrepresentable === "throw") {
              throw new Error("Date cannot be represented in JSON Schema");
            }
            break;
          }
          case "array": {
            const json = _json;
            const { minimum, maximum } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minItems = minimum;
            if (typeof maximum === "number")
              json.maxItems = maximum;
            json.type = "array";
            json.items = this.process(def.element, { ...params, path: [...params.path, "items"] });
            break;
          }
          case "object": {
            const json = _json;
            json.type = "object";
            json.properties = {};
            const shape = def.shape;
            for (const key in shape) {
              json.properties[key] = this.process(shape[key], {
                ...params,
                path: [...params.path, "properties", key]
              });
            }
            const allKeys = new Set(Object.keys(shape));
            const requiredKeys = new Set([...allKeys].filter((key) => {
              const v = def.shape[key]._zod;
              if (this.io === "input") {
                return v.optin === undefined;
              } else {
                return v.optout === undefined;
              }
            }));
            if (requiredKeys.size > 0) {
              json.required = Array.from(requiredKeys);
            }
            if (def.catchall?._zod.def.type === "never") {
              json.additionalProperties = false;
            } else if (!def.catchall) {
              if (this.io === "output")
                json.additionalProperties = false;
            } else if (def.catchall) {
              json.additionalProperties = this.process(def.catchall, {
                ...params,
                path: [...params.path, "additionalProperties"]
              });
            }
            break;
          }
          case "union": {
            const json = _json;
            const options = def.options.map((x, i) => this.process(x, {
              ...params,
              path: [...params.path, "anyOf", i]
            }));
            json.anyOf = options;
            break;
          }
          case "intersection": {
            const json = _json;
            const a = this.process(def.left, {
              ...params,
              path: [...params.path, "allOf", 0]
            });
            const b = this.process(def.right, {
              ...params,
              path: [...params.path, "allOf", 1]
            });
            const isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1;
            const allOf = [
              ...isSimpleIntersection(a) ? a.allOf : [a],
              ...isSimpleIntersection(b) ? b.allOf : [b]
            ];
            json.allOf = allOf;
            break;
          }
          case "tuple": {
            const json = _json;
            json.type = "array";
            const prefixPath = this.target === "draft-2020-12" ? "prefixItems" : "items";
            const restPath = this.target === "draft-2020-12" ? "items" : this.target === "openapi-3.0" ? "items" : "additionalItems";
            const prefixItems = def.items.map((x, i) => this.process(x, {
              ...params,
              path: [...params.path, prefixPath, i]
            }));
            const rest = def.rest ? this.process(def.rest, {
              ...params,
              path: [...params.path, restPath, ...this.target === "openapi-3.0" ? [def.items.length] : []]
            }) : null;
            if (this.target === "draft-2020-12") {
              json.prefixItems = prefixItems;
              if (rest) {
                json.items = rest;
              }
            } else if (this.target === "openapi-3.0") {
              json.items = {
                anyOf: prefixItems
              };
              if (rest) {
                json.items.anyOf.push(rest);
              }
              json.minItems = prefixItems.length;
              if (!rest) {
                json.maxItems = prefixItems.length;
              }
            } else {
              json.items = prefixItems;
              if (rest) {
                json.additionalItems = rest;
              }
            }
            const { minimum, maximum } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minItems = minimum;
            if (typeof maximum === "number")
              json.maxItems = maximum;
            break;
          }
          case "record": {
            const json = _json;
            json.type = "object";
            if (this.target === "draft-7" || this.target === "draft-2020-12") {
              json.propertyNames = this.process(def.keyType, {
                ...params,
                path: [...params.path, "propertyNames"]
              });
            }
            json.additionalProperties = this.process(def.valueType, {
              ...params,
              path: [...params.path, "additionalProperties"]
            });
            break;
          }
          case "map": {
            if (this.unrepresentable === "throw") {
              throw new Error("Map cannot be represented in JSON Schema");
            }
            break;
          }
          case "set": {
            if (this.unrepresentable === "throw") {
              throw new Error("Set cannot be represented in JSON Schema");
            }
            break;
          }
          case "enum": {
            const json = _json;
            const values = getEnumValues(def.entries);
            if (values.every((v) => typeof v === "number"))
              json.type = "number";
            if (values.every((v) => typeof v === "string"))
              json.type = "string";
            json.enum = values;
            break;
          }
          case "literal": {
            const json = _json;
            const vals = [];
            for (const val of def.values) {
              if (val === undefined) {
                if (this.unrepresentable === "throw") {
                  throw new Error("Literal `undefined` cannot be represented in JSON Schema");
                } else {
                }
              } else if (typeof val === "bigint") {
                if (this.unrepresentable === "throw") {
                  throw new Error("BigInt literals cannot be represented in JSON Schema");
                } else {
                  vals.push(Number(val));
                }
              } else {
                vals.push(val);
              }
            }
            if (vals.length === 0) {
            } else if (vals.length === 1) {
              const val = vals[0];
              json.type = val === null ? "null" : typeof val;
              if (this.target === "draft-4" || this.target === "openapi-3.0") {
                json.enum = [val];
              } else {
                json.const = val;
              }
            } else {
              if (vals.every((v) => typeof v === "number"))
                json.type = "number";
              if (vals.every((v) => typeof v === "string"))
                json.type = "string";
              if (vals.every((v) => typeof v === "boolean"))
                json.type = "string";
              if (vals.every((v) => v === null))
                json.type = "null";
              json.enum = vals;
            }
            break;
          }
          case "file": {
            const json = _json;
            const file = {
              type: "string",
              format: "binary",
              contentEncoding: "binary"
            };
            const { minimum, maximum, mime } = schema._zod.bag;
            if (minimum !== undefined)
              file.minLength = minimum;
            if (maximum !== undefined)
              file.maxLength = maximum;
            if (mime) {
              if (mime.length === 1) {
                file.contentMediaType = mime[0];
                Object.assign(json, file);
              } else {
                json.anyOf = mime.map((m) => {
                  const mFile = { ...file, contentMediaType: m };
                  return mFile;
                });
              }
            } else {
              Object.assign(json, file);
            }
            break;
          }
          case "transform": {
            if (this.unrepresentable === "throw") {
              throw new Error("Transforms cannot be represented in JSON Schema");
            }
            break;
          }
          case "nullable": {
            const inner = this.process(def.innerType, params);
            if (this.target === "openapi-3.0") {
              result.ref = def.innerType;
              _json.nullable = true;
            } else {
              _json.anyOf = [inner, { type: "null" }];
            }
            break;
          }
          case "nonoptional": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            break;
          }
          case "success": {
            const json = _json;
            json.type = "boolean";
            break;
          }
          case "default": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            _json.default = JSON.parse(JSON.stringify(def.defaultValue));
            break;
          }
          case "prefault": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            if (this.io === "input")
              _json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
            break;
          }
          case "catch": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            let catchValue;
            try {
              catchValue = def.catchValue(undefined);
            } catch {
              throw new Error("Dynamic catch values are not supported in JSON Schema");
            }
            _json.default = catchValue;
            break;
          }
          case "nan": {
            if (this.unrepresentable === "throw") {
              throw new Error("NaN cannot be represented in JSON Schema");
            }
            break;
          }
          case "template_literal": {
            const json = _json;
            const pattern = schema._zod.pattern;
            if (!pattern)
              throw new Error("Pattern not found in template literal");
            json.type = "string";
            json.pattern = pattern.source;
            break;
          }
          case "pipe": {
            const innerType = this.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
            this.process(innerType, params);
            result.ref = innerType;
            break;
          }
          case "readonly": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            _json.readOnly = true;
            break;
          }
          case "promise": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            break;
          }
          case "optional": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            break;
          }
          case "lazy": {
            const innerType = schema._zod.innerType;
            this.process(innerType, params);
            result.ref = innerType;
            break;
          }
          case "custom": {
            if (this.unrepresentable === "throw") {
              throw new Error("Custom types cannot be represented in JSON Schema");
            }
            break;
          }
          case "function": {
            if (this.unrepresentable === "throw") {
              throw new Error("Function types cannot be represented in JSON Schema");
            }
            break;
          }
          default: {
          }
        }
      }
    }
    const meta = this.metadataRegistry.get(schema);
    if (meta)
      Object.assign(result.schema, meta);
    if (this.io === "input" && isTransforming(schema)) {
      delete result.schema.examples;
      delete result.schema.default;
    }
    if (this.io === "input" && result.schema._prefault)
      (_a = result.schema).default ?? (_a.default = result.schema._prefault);
    delete result.schema._prefault;
    const _result = this.seen.get(schema);
    return _result.schema;
  }
  emit(schema, _params) {
    const params = {
      cycles: _params?.cycles ?? "ref",
      reused: _params?.reused ?? "inline",
      external: _params?.external ?? undefined
    };
    const root = this.seen.get(schema);
    if (!root)
      throw new Error("Unprocessed schema. This is a bug in Zod.");
    const makeURI = (entry) => {
      const defsSegment = this.target === "draft-2020-12" ? "$defs" : "definitions";
      if (params.external) {
        const externalId = params.external.registry.get(entry[0])?.id;
        const uriGenerator = params.external.uri ?? ((id2) => id2);
        if (externalId) {
          return { ref: uriGenerator(externalId) };
        }
        const id = entry[1].defId ?? entry[1].schema.id ?? `schema${this.counter++}`;
        entry[1].defId = id;
        return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
      }
      if (entry[1] === root) {
        return { ref: "#" };
      }
      const uriPrefix = `#`;
      const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
      const defId = entry[1].schema.id ?? `__schema${this.counter++}`;
      return { defId, ref: defUriPrefix + defId };
    };
    const extractToDef = (entry) => {
      if (entry[1].schema.$ref) {
        return;
      }
      const seen = entry[1];
      const { ref, defId } = makeURI(entry);
      seen.def = { ...seen.schema };
      if (defId)
        seen.defId = defId;
      const schema2 = seen.schema;
      for (const key in schema2) {
        delete schema2[key];
      }
      schema2.$ref = ref;
    };
    if (params.cycles === "throw") {
      for (const entry of this.seen.entries()) {
        const seen = entry[1];
        if (seen.cycle) {
          throw new Error("Cycle detected: " + `#/${seen.cycle?.join("/")}/<root>` + '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
        }
      }
    }
    for (const entry of this.seen.entries()) {
      const seen = entry[1];
      if (schema === entry[0]) {
        extractToDef(entry);
        continue;
      }
      if (params.external) {
        const ext = params.external.registry.get(entry[0])?.id;
        if (schema !== entry[0] && ext) {
          extractToDef(entry);
          continue;
        }
      }
      const id = this.metadataRegistry.get(entry[0])?.id;
      if (id) {
        extractToDef(entry);
        continue;
      }
      if (seen.cycle) {
        extractToDef(entry);
        continue;
      }
      if (seen.count > 1) {
        if (params.reused === "ref") {
          extractToDef(entry);
          continue;
        }
      }
    }
    const flattenRef = (zodSchema, params2) => {
      const seen = this.seen.get(zodSchema);
      const schema2 = seen.def ?? seen.schema;
      const _cached = { ...schema2 };
      if (seen.ref === null) {
        return;
      }
      const ref = seen.ref;
      seen.ref = null;
      if (ref) {
        flattenRef(ref, params2);
        const refSchema = this.seen.get(ref).schema;
        if (refSchema.$ref && (params2.target === "draft-7" || params2.target === "draft-4" || params2.target === "openapi-3.0")) {
          schema2.allOf = schema2.allOf ?? [];
          schema2.allOf.push(refSchema);
        } else {
          Object.assign(schema2, refSchema);
          Object.assign(schema2, _cached);
        }
      }
      if (!seen.isParent)
        this.override({
          zodSchema,
          jsonSchema: schema2,
          path: seen.path ?? []
        });
    };
    for (const entry of [...this.seen.entries()].reverse()) {
      flattenRef(entry[0], { target: this.target });
    }
    const result = {};
    if (this.target === "draft-2020-12") {
      result.$schema = "https://json-schema.org/draft/2020-12/schema";
    } else if (this.target === "draft-7") {
      result.$schema = "http://json-schema.org/draft-07/schema#";
    } else if (this.target === "draft-4") {
      result.$schema = "http://json-schema.org/draft-04/schema#";
    } else if (this.target === "openapi-3.0") {
    } else {
      console.warn(`Invalid target: ${this.target}`);
    }
    if (params.external?.uri) {
      const id = params.external.registry.get(schema)?.id;
      if (!id)
        throw new Error("Schema is missing an `id` property");
      result.$id = params.external.uri(id);
    }
    Object.assign(result, root.def);
    const defs = params.external?.defs ?? {};
    for (const entry of this.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        defs[seen.defId] = seen.def;
      }
    }
    if (params.external) {
    } else {
      if (Object.keys(defs).length > 0) {
        if (this.target === "draft-2020-12") {
          result.$defs = defs;
        } else {
          result.definitions = defs;
        }
      }
    }
    try {
      return JSON.parse(JSON.stringify(result));
    } catch (_err) {
      throw new Error("Error converting schema to JSON.");
    }
  }
}
function toJSONSchema(input, _params) {
  if (input instanceof $ZodRegistry) {
    const gen2 = new JSONSchemaGenerator(_params);
    const defs = {};
    for (const entry of input._idmap.entries()) {
      const [_, schema] = entry;
      gen2.process(schema);
    }
    const schemas = {};
    const external = {
      registry: input,
      uri: _params?.uri,
      defs
    };
    for (const entry of input._idmap.entries()) {
      const [key, schema] = entry;
      schemas[key] = gen2.emit(schema, {
        ..._params,
        external
      });
    }
    if (Object.keys(defs).length > 0) {
      const defsSegment = gen2.target === "draft-2020-12" ? "$defs" : "definitions";
      schemas.__shared = {
        [defsSegment]: defs
      };
    }
    return { schemas };
  }
  const gen = new JSONSchemaGenerator(_params);
  gen.process(input);
  return gen.emit(input, _params);
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: new Set };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const schema = _schema;
  const def = schema._zod.def;
  switch (def.type) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "date":
    case "symbol":
    case "undefined":
    case "null":
    case "any":
    case "unknown":
    case "never":
    case "void":
    case "literal":
    case "enum":
    case "nan":
    case "file":
    case "template_literal":
      return false;
    case "array": {
      return isTransforming(def.element, ctx);
    }
    case "object": {
      for (const key in def.shape) {
        if (isTransforming(def.shape[key], ctx))
          return true;
      }
      return false;
    }
    case "union": {
      for (const option of def.options) {
        if (isTransforming(option, ctx))
          return true;
      }
      return false;
    }
    case "intersection": {
      return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
    }
    case "tuple": {
      for (const item of def.items) {
        if (isTransforming(item, ctx))
          return true;
      }
      if (def.rest && isTransforming(def.rest, ctx))
        return true;
      return false;
    }
    case "record": {
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    case "map": {
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    case "set": {
      return isTransforming(def.valueType, ctx);
    }
    case "promise":
    case "optional":
    case "nonoptional":
    case "nullable":
    case "readonly":
      return isTransforming(def.innerType, ctx);
    case "lazy":
      return isTransforming(def.getter(), ctx);
    case "default": {
      return isTransforming(def.innerType, ctx);
    }
    case "prefault": {
      return isTransforming(def.innerType, ctx);
    }
    case "custom": {
      return false;
    }
    case "transform": {
      return true;
    }
    case "pipe": {
      return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
    }
    case "success": {
      return false;
    }
    case "catch": {
      return false;
    }
    case "function": {
      return false;
    }
    default:
  }
  throw new Error(`Unknown schema type: ${def.type}`);
}
// node_modules/zod/v4/classic/errors.js
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
    },
    addIssue: {
      value: (issue2) => {
        inst.issues.push(issue2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    addIssues: {
      value: (issues2) => {
        inst.issues.push(...issues2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
    }
  });
};
var ZodError = $constructor("ZodError", initializer2);
var ZodRealError = $constructor("ZodError", initializer2, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse3 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  $ZodType.init(inst, def);
  inst.def = def;
  inst.type = def.type;
  Object.defineProperty(inst, "_def", { value: def });
  inst.check = (...checks2) => {
    return inst.clone({
      ...def,
      checks: [
        ...def.checks ?? [],
        ...checks2.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
      ]
    });
  };
  inst.clone = (def2, params) => clone(inst, def2, params);
  inst.brand = () => inst;
  inst.register = (reg, meta) => {
    reg.add(inst, meta);
    return inst;
  };
  inst.parse = (data, params) => parse3(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse2(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.encode = (data, params) => encode(inst, data, params);
  inst.decode = (data, params) => decode(inst, data, params);
  inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
  inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
  inst.safeEncode = (data, params) => safeEncode(inst, data, params);
  inst.safeDecode = (data, params) => safeDecode(inst, data, params);
  inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
  inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
  inst.refine = (check, params) => inst.check(refine(check, params));
  inst.superRefine = (refinement) => inst.check(superRefine(refinement));
  inst.overwrite = (fn) => inst.check(_overwrite(fn));
  inst.optional = () => optional(inst);
  inst.nullable = () => nullable(inst);
  inst.nullish = () => optional(nullable(inst));
  inst.nonoptional = (params) => nonoptional(inst, params);
  inst.array = () => array(inst);
  inst.or = (arg) => union([inst, arg]);
  inst.and = (arg) => intersection(inst, arg);
  inst.transform = (tx) => pipe(inst, transform(tx));
  inst.default = (def2) => _default(inst, def2);
  inst.prefault = (def2) => prefault(inst, def2);
  inst.catch = (params) => _catch(inst, params);
  inst.pipe = (target) => pipe(inst, target);
  inst.readonly = () => readonly(inst);
  inst.describe = (description) => {
    const cl = inst.clone();
    globalRegistry.add(cl, { description });
    return cl;
  };
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  inst.meta = (...args) => {
    if (args.length === 0) {
      return globalRegistry.get(inst);
    }
    const cl = inst.clone();
    globalRegistry.add(cl, args[0]);
    return cl;
  };
  inst.isOptional = () => inst.safeParse(undefined).success;
  inst.isNullable = () => inst.safeParse(null).success;
  return inst;
});
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst.element = def.element;
  inst.min = (minLength, params) => inst.check(_minLength(minLength, params));
  inst.nonempty = (params) => inst.check(_minLength(1, params));
  inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params));
  inst.length = (len, params) => inst.check(_length(len, params));
  inst.unwrap = () => inst.element;
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  exports_util.defineLazy(inst, "shape", () => def.shape);
  inst.keyof = () => _enum(Object.keys(inst._zod.def.shape));
  inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall });
  inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
  inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
  inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() });
  inst.strip = () => inst.clone({ ...inst._zod.def, catchall: undefined });
  inst.extend = (incoming) => {
    return exports_util.extend(inst, incoming);
  };
  inst.safeExtend = (incoming) => {
    return exports_util.safeExtend(inst, incoming);
  };
  inst.merge = (other) => exports_util.merge(inst, other);
  inst.pick = (mask) => exports_util.pick(inst, mask);
  inst.omit = (mask) => exports_util.omit(inst, mask);
  inst.partial = (...args) => exports_util.partial(ZodOptional, inst, args[0]);
  inst.required = (...args) => exports_util.required(ZodNonOptional, inst, args[0]);
});
function object(shape, params) {
  const def = {
    type: "object",
    get shape() {
      exports_util.assignProp(this, "shape", shape ? exports_util.objectClone(shape) : {});
      return this.shape;
    },
    ...exports_util.normalizeParams(params)
  };
  return new ZodObject(def);
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...exports_util.normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst.enum = def.entries;
  inst.options = Object.values(def.entries);
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...exports_util.normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...exports_util.normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...exports_util.normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(exports_util.issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(exports_util.issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output2) => {
        payload.value = output2;
        return payload;
      });
    }
    payload.value = output;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : exports_util.shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : exports_util.shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...exports_util.normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
});
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn) {
  return _superRefine(fn);
}
// node_modules/zod/v4/classic/external.js
config(en_default());

// node_modules/zod-openapi/dist/components-D0GND9iu.js
var isAnyZodType = (schema) => typeof schema === "object" && schema !== null && ("_zod" in schema);
var createExamples = (examples, registry$1, path) => {
  if (!examples)
    return;
  const examplesObject = {};
  for (const [name, example] of Object.entries(examples)) {
    const exampleObject = registry$1.addExample(example, [...path, name]);
    examplesObject[name] = exampleObject;
  }
  return examplesObject;
};
var createMediaTypeObject = (mediaType, ctx, path) => {
  const { schema, examples, ...rest } = mediaType;
  const mediaTypeObject = rest;
  if (isAnyZodType(schema)) {
    const schemaObject = ctx.registry.addSchema(schema, [...path, "schema"], {
      io: ctx.io,
      source: { type: "mediaType" }
    });
    mediaTypeObject.schema = schemaObject;
  } else
    mediaTypeObject.schema = schema;
  if (examples)
    mediaTypeObject.examples = createExamples(examples, ctx.registry, [...path, "examples"]);
  return mediaTypeObject;
};
var createContent = (content, ctx, path) => {
  const contentObject = {};
  for (const [mediaType, mediaTypeObject] of Object.entries(content))
    if (mediaTypeObject)
      contentObject[mediaType] = createMediaTypeObject(mediaTypeObject, ctx, [...path, mediaType]);
  return contentObject;
};
var unwrapZodObject = (zodType, io, path) => {
  const def = zodType._zod.def;
  switch (def.type) {
    case "object":
      return zodType;
    case "lazy":
      return unwrapZodObject(def.getter(), io, path);
    case "pipe":
      if (io === "input")
        return unwrapZodObject(def.in, io, path);
      return unwrapZodObject(def.out, io, path);
  }
  throw new Error(`Failed to unwrap ZodObject from type: ${zodType._zod.def.type} at ${path.join(" > ")}`);
};
var isRequired = (zodType, io) => {
  if (io === "input")
    return zodType._zod.optin === undefined;
  return zodType._zod.optout === undefined;
};
var createHeaders = (headers, registry$1, path) => {
  if (!headers)
    return;
  if (isAnyZodType(headers)) {
    const zodObject = unwrapZodObject(headers, "output", path);
    const headersObject = {};
    for (const [key, zodSchema] of Object.entries(zodObject._zod.def.shape)) {
      const header = registry$1.addHeader(zodSchema, [...path, key]);
      headersObject[key] = header;
    }
    return headersObject;
  }
  return headers;
};
var createLinks = (links, registry$1, path) => {
  if (!links)
    return;
  const linksObject = {};
  for (const [name, link] of Object.entries(links)) {
    const linkObject = registry$1.addLink(link, [...path, name]);
    linksObject[name] = linkObject;
  }
  return linksObject;
};
var createManualParameters = (parameters, registry$1, path) => {
  if (!parameters)
    return;
  const parameterObjects = [];
  for (const parameter of parameters) {
    if (isAnyZodType(parameter)) {
      const paramObject = registry$1.addParameter(parameter, [...path, "parameters"]);
      parameterObjects.push(paramObject);
      continue;
    }
    parameterObjects.push(parameter);
  }
  return parameterObjects;
};
var createParameters = (requestParams, registry$1, path) => {
  if (!requestParams)
    return;
  const parameterObjects = [];
  for (const [location, schema] of Object.entries(requestParams ?? {})) {
    const zodObject = unwrapZodObject(schema, "input", path);
    for (const [name, zodSchema] of Object.entries(zodObject._zod.def.shape)) {
      const paramObject = registry$1.addParameter(zodSchema, [
        ...path,
        location,
        name
      ], { location: {
        in: location,
        name
      } });
      parameterObjects.push(paramObject);
    }
  }
  return parameterObjects;
};
var isISpecificationExtension = (key) => key.startsWith("x-");
var createCallbacks = (callbacks, registry$1, path) => {
  if (!callbacks)
    return;
  const callbacksObject = {};
  for (const [name, value] of Object.entries(callbacks)) {
    if (isISpecificationExtension(name)) {
      callbacksObject[name] = value;
      continue;
    }
    callbacksObject[name] = registry$1.addCallback(value, [...path, name]);
  }
  return callbacksObject;
};
var createResponses = (responses, registry$1, path) => {
  if (!responses)
    return;
  const responsesObject = {};
  for (const [statusCode, response] of Object.entries(responses)) {
    if (!response)
      continue;
    if (isISpecificationExtension(statusCode)) {
      responsesObject[statusCode] = response;
      continue;
    }
    if ("$ref" in response) {
      responsesObject[statusCode] = response;
      continue;
    }
    const responseObject = registry$1.addResponse(response, [...path, statusCode]);
    responsesObject[statusCode] = responseObject;
  }
  return responsesObject;
};
var createOperation = (operation, registry$1, path) => {
  const { parameters, requestParams, requestBody, responses, callbacks, ...rest } = operation;
  const operationObject = rest;
  const maybeManualParameters = createManualParameters(parameters, registry$1, [...path, "parameters"]);
  const maybeRequestParams = createParameters(requestParams, registry$1, [...path, "requestParams"]);
  if (maybeRequestParams || maybeManualParameters)
    operationObject.parameters = [...maybeRequestParams ?? [], ...maybeManualParameters ?? []];
  const maybeRequestBody = requestBody && registry$1.addRequestBody(requestBody, path);
  if (maybeRequestBody)
    operationObject.requestBody = maybeRequestBody;
  const maybeResponses = createResponses(responses, registry$1, [...path, "responses"]);
  if (maybeResponses)
    operationObject.responses = maybeResponses;
  const maybeCallbacks = createCallbacks(callbacks, registry$1, [...path, "callbacks"]);
  if (maybeCallbacks)
    operationObject.callbacks = maybeCallbacks;
  return operationObject;
};
var createPaths = (paths, registry$1, path) => {
  if (!paths)
    return;
  const pathsObject = {};
  for (const [singlePath, pathItemObject] of Object.entries(paths)) {
    if (isISpecificationExtension(singlePath)) {
      pathsObject[singlePath] = pathItemObject;
      continue;
    }
    pathsObject[singlePath] = registry$1.addPathItem(pathItemObject, [...path, singlePath]);
  }
  return pathsObject;
};
var openApiVersions = [
  "3.0.0",
  "3.0.1",
  "3.0.2",
  "3.0.3",
  "3.1.0",
  "3.1.1"
];
var satisfiesVersion = (test, against) => openApiVersions.indexOf(test) >= openApiVersions.indexOf(against);
var override = (ctx) => {
  const def = ctx.zodSchema._zod.def;
  switch (def.type) {
    case "bigint":
      ctx.jsonSchema.type = "integer";
      ctx.jsonSchema.format = "int64";
      break;
    case "union": {
      if ("discriminator" in def && typeof def.discriminator === "string") {
        ctx.jsonSchema.oneOf = ctx.jsonSchema.anyOf;
        delete ctx.jsonSchema.anyOf;
        ctx.jsonSchema.type = "object";
        ctx.jsonSchema.discriminator = { propertyName: def.discriminator };
        const mapping = {};
        for (const [index, obj] of Object.entries(ctx.jsonSchema.oneOf)) {
          const ref = obj.$ref;
          if (!ref) {
            delete ctx.jsonSchema.discriminator;
            return;
          }
          const discriminatorValues = def.options[Number(index)]._zod.propValues?.[def.discriminator];
          if (!discriminatorValues?.size)
            return;
          for (const value of [...discriminatorValues ?? []]) {
            if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean")
              return;
            mapping[String(value)] = ref;
          }
        }
        ctx.jsonSchema.discriminator.mapping = mapping;
      }
      const meta = ctx.zodSchema.meta();
      if (typeof meta?.unionOneOf === "boolean") {
        if (meta.unionOneOf) {
          ctx.jsonSchema.oneOf = ctx.jsonSchema.anyOf;
          delete ctx.jsonSchema.anyOf;
        }
        delete ctx.jsonSchema.unionOneOf;
      }
      break;
    }
    case "date":
      ctx.jsonSchema.type = "string";
      break;
    case "literal":
      if (def.values.includes(undefined))
        break;
      break;
    case "undefined":
      ctx.jsonSchema.not = {};
      break;
  }
};
var validate = (ctx, opts) => {
  if (Object.keys(ctx.jsonSchema).length)
    return;
  const def = ctx.zodSchema._zod.def;
  const allowEmptySchema = opts.allowEmptySchema?.[def.type];
  if (allowEmptySchema === true || allowEmptySchema?.[ctx.io])
    return;
  switch (def.type) {
    case "optional":
      validate({
        ...ctx,
        zodSchema: def.innerType
      }, opts);
      return;
    case "any":
      return;
    case "unknown":
      return;
    case "pipe":
      if (ctx.io === "output")
        throw new Error(`Zod transform found at ${ctx.path.join(" > ")} are not supported in output schemas. Please use \`.overwrite()\` or wrap the schema in a \`.pipe()\` or assign it manual metadata with \`.meta()\``);
      return;
    case "transform":
      if (ctx.io === "output")
        return;
      break;
    case "literal":
      if (def.values.includes(undefined))
        throw new Error(`Zod literal at ${ctx.path.join(" > ")} cannot include \`undefined\` as a value. Please use \`z.undefined()\` or \`.optional()\` instead.`);
      return;
  }
  throw new Error(`Zod schema of type \`${def.type}\` at ${ctx.path.join(" > ")} cannot be represented in OpenAPI. Please assign it metadata with \`.meta()\``);
};
var renameComponents = (components, outputIds, ctx, refPath) => {
  const componentsToRename = /* @__PURE__ */ new Map;
  if (ctx.io === "input")
    return componentsToRename;
  const componentDependencies = /* @__PURE__ */ new Map;
  const stringifiedComponents = /* @__PURE__ */ new Map;
  for (const [key, value] of Object.entries(components)) {
    const stringified = JSON.stringify(value);
    const regex = new RegExp(`"${refPath}([^"]+)"`, "g");
    const matches = stringified.matchAll(regex);
    const dependencies = /* @__PURE__ */ new Set;
    for (const match of matches) {
      const dep = match[1];
      if (dep !== key)
        dependencies.add(dep);
    }
    stringifiedComponents.set(key, stringified);
    componentDependencies.set(key, { dependencies });
  }
  for (const [key] of stringifiedComponents) {
    const registeredComponent = ctx.registry.components.schemas.ids.get(key);
    if (!registeredComponent)
      continue;
    if (isDependencyPure(componentDependencies, stringifiedComponents, ctx.registry, key))
      continue;
    const newName = outputIds.get(key) ?? `${key}${ctx.opts.outputIdSuffix ?? "Output"}`;
    componentsToRename.set(key, newName);
    components[newName] = components[key];
    delete components[key];
    continue;
  }
  return componentsToRename;
};
var isDependencyPure = (componentDependencies, stringifiedComponents, registry$1, key, visited = /* @__PURE__ */ new Set) => {
  if (visited.has(key))
    return true;
  const dependencies = componentDependencies.get(key);
  if (dependencies.pure !== undefined)
    return dependencies.pure;
  const stringified = stringifiedComponents.get(key);
  const component = registry$1.components.schemas.ids.get(key);
  if (component && stringified !== JSON.stringify(component)) {
    dependencies.pure = false;
    return false;
  }
  visited.add(key);
  const result = [...dependencies.dependencies].every((dep) => isDependencyPure(componentDependencies, stringifiedComponents, registry$1, dep, new Set(visited)));
  dependencies.pure = result;
  return result;
};
var zodOpenApiMetadataFields = [
  "param",
  "header",
  "unusedIO",
  "override",
  "outputId"
];
var deleteZodOpenApiMeta = (jsonSchema) => {
  zodOpenApiMetadataFields.forEach((field) => {
    delete jsonSchema[field];
  });
};
var deleteInvalidJsonSchemaFields = (jsonSchema) => {
  delete jsonSchema.$schema;
  delete jsonSchema.id;
  delete jsonSchema.$id;
};
var createSchemas = (schemas3, ctx) => {
  const refPath = ctx.opts.schemaRefPath ?? "#/components/schemas/";
  const entries = {};
  for (const [name, { zodType }] of Object.entries(schemas3))
    entries[name] = zodType;
  const zodRegistry = registry();
  zodRegistry.add(object(entries), { id: "zodOpenApiCreateSchema" });
  for (const [id, { zodType }] of ctx.registry.components.schemas.manual)
    zodRegistry.add(zodType, { id });
  const outputIds = /* @__PURE__ */ new Map;
  const jsonSchema = toJSONSchema(zodRegistry, {
    override(context) {
      const meta = context.zodSchema.meta();
      if (meta?.outputId && meta?.id)
        outputIds.set(meta.id, meta.outputId);
      if (context.jsonSchema.$ref)
        return;
      const enrichedContext = {
        ...context,
        io: ctx.io
      };
      override(enrichedContext);
      if (typeof ctx.opts.override === "function")
        ctx.opts.override(enrichedContext);
      if (typeof meta?.override === "function") {
        meta.override(enrichedContext);
        delete context.jsonSchema.override;
      }
      if (typeof meta?.override === "object" && meta.override !== null) {
        Object.assign(context.jsonSchema, meta.override);
        delete context.jsonSchema.override;
      }
      deleteInvalidJsonSchemaFields(context.jsonSchema);
      deleteZodOpenApiMeta(context.jsonSchema);
      validate(enrichedContext, ctx.opts);
    },
    io: ctx.io,
    unrepresentable: "any",
    reused: ctx.opts.reused,
    cycles: ctx.opts.cycles,
    target: satisfiesVersion(ctx.openapiVersion ?? "3.1.0", "3.1.0") ? undefined : "openapi-3.0",
    uri: (id) => id === "__shared" ? `#ZOD_OPENAPI/${id}` : `#ZOD_OPENAPI/__shared#/$defs/${id}`
  });
  const components = jsonSchema.schemas.__shared?.$defs ?? {};
  jsonSchema.schemas.__shared ??= { $defs: components };
  const dynamicComponents = /* @__PURE__ */ new Map;
  for (const [key, value] of Object.entries(components)) {
    deleteInvalidJsonSchemaFields(value);
    if (/^schema\d+$/.test(key)) {
      const newName = `__schema${ctx.registry.components.schemas.dynamicSchemaCount++}`;
      dynamicComponents.set(key, `"${refPath}${newName}"`);
      if (newName !== key) {
        components[newName] = value;
        delete components[key];
      }
    }
  }
  for (const [key] of ctx.registry.components.schemas.manual) {
    const manualComponent = jsonSchema.schemas[key];
    if (!manualComponent)
      continue;
    deleteInvalidJsonSchemaFields(manualComponent);
  }
  const manualUsed = {};
  const parsedJsonSchema = JSON.parse(JSON.stringify(jsonSchema).replace(/"#ZOD_OPENAPI\/__shared#\/\$defs\/([^"]+)"/g, (_, match) => {
    const dynamic = dynamicComponents.get(match);
    if (dynamic)
      return dynamic;
    const manualComponent = ctx.registry.components.schemas.manual.get(match);
    if (manualComponent)
      manualUsed[match] = true;
    return `"${refPath}${match}"`;
  }));
  const parsedComponents = parsedJsonSchema.schemas.__shared?.$defs ?? {};
  parsedJsonSchema.schemas.__shared ??= { $defs: parsedComponents };
  for (const [key] of ctx.registry.components.schemas.manual) {
    const manualComponent = parsedJsonSchema.schemas[key];
    if (!manualComponent)
      continue;
    if (manualUsed[key]) {
      if (parsedComponents[key])
        throw new Error(`Component "${key}" is already registered as a component in the registry`);
      parsedComponents[key] = manualComponent;
    }
  }
  const componentsToRename = renameComponents(parsedComponents, outputIds, ctx, refPath);
  if (!componentsToRename.size) {
    const parsedSchemas = parsedJsonSchema.schemas.zodOpenApiCreateSchema?.properties;
    delete parsedJsonSchema.schemas.zodOpenApiCreateSchema;
    delete parsedJsonSchema.schemas.__shared;
    return {
      schemas: parsedSchemas,
      components: parsedComponents,
      manual: parsedJsonSchema.schemas
    };
  }
  const renamedJsonSchema = JSON.parse(JSON.stringify(parsedJsonSchema).replace(new RegExp(`"${refPath}([^"]+)"`, "g"), (_, match) => {
    const replacement = componentsToRename.get(match);
    if (replacement)
      return `"${refPath}${replacement}"`;
    return `"${refPath}${match}"`;
  }));
  const renamedSchemas = renamedJsonSchema.schemas.zodOpenApiCreateSchema?.properties;
  const renamedComponents = renamedJsonSchema.schemas.__shared?.$defs ?? {};
  delete renamedJsonSchema.schemas.zodOpenApiCreateSchema;
  delete renamedJsonSchema.schemas.__shared;
  return {
    schemas: renamedSchemas,
    components: renamedComponents,
    manual: renamedJsonSchema.schemas
  };
};
var createRegistry = (components) => {
  const registry$1 = {
    components: {
      schemas: {
        dynamicSchemaCount: 0,
        input: /* @__PURE__ */ new Map,
        output: /* @__PURE__ */ new Map,
        ids: /* @__PURE__ */ new Map,
        manual: /* @__PURE__ */ new Map
      },
      headers: {
        ids: /* @__PURE__ */ new Map,
        seen: /* @__PURE__ */ new WeakMap
      },
      requestBodies: {
        ids: /* @__PURE__ */ new Map,
        seen: /* @__PURE__ */ new WeakMap
      },
      responses: {
        ids: /* @__PURE__ */ new Map,
        seen: /* @__PURE__ */ new WeakMap
      },
      parameters: {
        ids: /* @__PURE__ */ new Map,
        seen: /* @__PURE__ */ new WeakMap
      },
      callbacks: {
        ids: /* @__PURE__ */ new Map,
        seen: /* @__PURE__ */ new WeakMap
      },
      pathItems: {
        ids: /* @__PURE__ */ new Map,
        seen: /* @__PURE__ */ new WeakMap
      },
      securitySchemes: {
        ids: /* @__PURE__ */ new Map,
        seen: /* @__PURE__ */ new WeakMap
      },
      links: {
        ids: /* @__PURE__ */ new Map,
        seen: /* @__PURE__ */ new WeakMap
      },
      examples: {
        ids: /* @__PURE__ */ new Map,
        seen: /* @__PURE__ */ new WeakMap
      }
    },
    addSchema: (schema, path, opts) => {
      const schemaObject = {};
      registry$1.components.schemas[opts.io].set(path.join(" > "), {
        schemaObject,
        zodType: schema,
        source: {
          path,
          ...opts?.source
        }
      });
      return schemaObject;
    },
    addParameter: (parameter, path, opts) => {
      const seenParameter = registry$1.components.parameters.seen.get(parameter);
      if (seenParameter)
        return seenParameter;
      const meta = globalRegistry.get(parameter);
      const name = opts?.location?.name ?? meta?.param?.name;
      const inLocation = opts?.location?.in ?? meta?.param?.in;
      if (opts?.location?.name && meta?.param?.name || opts?.location?.in && meta?.param?.in)
        throw new Error(`Parameter at ${path.join(" > ")} has both \`.meta({ param: { name, in } })\` and \`.meta({ param: { location: { in, name } } })\` information`);
      if (!name || !inLocation)
        throw new Error(`Parameter at ${path.join(" > ")} is missing \`.meta({ param: { name, in } })\` information`);
      const schemaObject = registry$1.addSchema(parameter, [
        ...path,
        inLocation,
        name,
        "schema"
      ], {
        io: "input",
        source: {
          type: "parameter",
          location: {
            in: inLocation,
            name
          }
        }
      });
      const { id: metaId, examples, ...rest } = meta?.param ?? {};
      const parameterObject = {
        in: inLocation,
        name,
        schema: schemaObject,
        ...rest
      };
      const examplesObject = createExamples(examples, registry$1, [
        ...path,
        inLocation,
        name,
        "examples"
      ]);
      if (examplesObject)
        parameterObject.examples = examplesObject;
      if (isRequired(parameter, "input"))
        parameterObject.required = true;
      if (!parameterObject.description && meta?.description)
        parameterObject.description = meta.description;
      const id = metaId ?? opts?.manualId;
      if (id) {
        if (registry$1.components.parameters.ids.has(id))
          throw new Error(`Schema "${id}" at ${path.join(" > ")} is already registered`);
        const ref = { $ref: `#/components/parameters/${id}` };
        registry$1.components.parameters.seen.set(parameter, ref);
        registry$1.components.parameters.ids.set(id, parameterObject);
        if (opts?.manualId)
          return parameterObject;
        return ref;
      }
      if (opts?.location?.name || opts?.location?.in)
        return parameterObject;
      registry$1.components.parameters.seen.set(parameter, parameterObject);
      return parameterObject;
    },
    addHeader: (header, path, opts) => {
      const seenHeader = registry$1.components.headers.seen.get(header);
      if (seenHeader)
        return seenHeader;
      const meta = globalRegistry.get(header);
      const { id: metaId, ...rest } = meta?.header ?? {};
      const id = metaId ?? opts?.manualId;
      const headerObject = rest;
      if (isRequired(header, "output"))
        headerObject.required = true;
      if (!headerObject.description && meta?.description)
        headerObject.description = meta.description;
      headerObject.schema = registry$1.addSchema(header, [...path, "schema"], {
        io: "output",
        source: { type: "header" }
      });
      if (id) {
        if (registry$1.components.schemas.ids.has(id))
          throw new Error(`Schema "${id}" at ${path.join(" > ")} is already registered`);
        const ref = { $ref: `#/components/headers/${id}` };
        registry$1.components.headers.ids.set(id, headerObject);
        registry$1.components.headers.seen.set(header, ref);
        if (opts?.manualId)
          return headerObject;
        return ref;
      }
      registry$1.components.headers.seen.set(header, headerObject);
      return headerObject;
    },
    addRequestBody: (requestBody, path, opts) => {
      const seenRequestBody = registry$1.components.requestBodies.seen.get(requestBody);
      if (seenRequestBody)
        return seenRequestBody;
      const { content, id: metaId, ...rest } = requestBody;
      const requestBodyObject = {
        ...rest,
        content: createContent(content, {
          registry: registry$1,
          io: "input"
        }, [...path, "content"])
      };
      const id = metaId ?? opts?.manualId;
      if (id) {
        if (registry$1.components.requestBodies.ids.has(id))
          throw new Error(`RequestBody "${id}" at ${path.join(" > ")} is already registered`);
        const ref = { $ref: `#/components/requestBodies/${id}` };
        registry$1.components.requestBodies.ids.set(id, requestBodyObject);
        registry$1.components.requestBodies.seen.set(requestBody, ref);
        if (opts?.manualId)
          return requestBodyObject;
        return ref;
      }
      registry$1.components.requestBodies.seen.set(requestBody, requestBodyObject);
      return requestBodyObject;
    },
    addPathItem: (pathItem, path, opts) => {
      const seenPathItem = registry$1.components.pathItems.seen.get(pathItem);
      if (seenPathItem)
        return seenPathItem;
      const pathItemObject = {};
      const { id: metaId, ...rest } = pathItem;
      const id = metaId ?? opts?.manualId;
      for (const [key, value] of Object.entries(rest)) {
        if (isISpecificationExtension(key)) {
          pathItemObject[key] = value;
          continue;
        }
        if (key === "get" || key === "put" || key === "post" || key === "delete" || key === "options" || key === "head" || key === "patch" || key === "trace") {
          pathItemObject[key] = createOperation(value, registry$1, [...path, key]);
          continue;
        }
        if (key === "parameters") {
          pathItemObject[key] = createManualParameters(value, registry$1, [...path, key]);
          continue;
        }
        pathItemObject[key] = value;
      }
      if (id) {
        if (registry$1.components.pathItems.ids.has(id))
          throw new Error(`PathItem "${id}" at ${path.join(" > ")} is already registered`);
        const ref = { $ref: `#/components/pathItems/${id}` };
        registry$1.components.pathItems.ids.set(id, pathItemObject);
        registry$1.components.pathItems.seen.set(pathItem, ref);
        if (opts?.manualId)
          return pathItemObject;
        return ref;
      }
      registry$1.components.pathItems.seen.set(pathItem, pathItemObject);
      return pathItemObject;
    },
    addResponse: (response, path, opts) => {
      const seenResponse = registry$1.components.responses.seen.get(response);
      if (seenResponse)
        return seenResponse;
      const { content, headers, links, id: metaId, ...rest } = response;
      const responseObject = rest;
      const maybeHeaders = createHeaders(headers, registry$1, [...path, "headers"]);
      if (maybeHeaders)
        responseObject.headers = maybeHeaders;
      if (content)
        responseObject.content = createContent(content, {
          registry: registry$1,
          io: "output"
        }, [...path, "content"]);
      if (links)
        responseObject.links = createLinks(links, registry$1, [...path, "links"]);
      const id = metaId ?? opts?.manualId;
      if (id) {
        if (registry$1.components.responses.ids.has(id))
          throw new Error(`Response "${id}" at ${path.join(" > ")} is already registered`);
        const ref = { $ref: `#/components/responses/${id}` };
        registry$1.components.responses.ids.set(id, responseObject);
        registry$1.components.responses.seen.set(response, ref);
        if (opts?.manualId)
          return responseObject;
        return ref;
      }
      registry$1.components.responses.seen.set(response, responseObject);
      return responseObject;
    },
    addCallback: (callback, path, opts) => {
      const seenCallback = registry$1.components.callbacks.seen.get(callback);
      if (seenCallback)
        return seenCallback;
      const { id: metaId, ...rest } = callback;
      const callbackObject = {};
      for (const [name, pathItem] of Object.entries(rest)) {
        if (isISpecificationExtension(name)) {
          callbackObject[name] = pathItem;
          continue;
        }
        callbackObject[name] = registry$1.addPathItem(pathItem, [...path, name]);
      }
      const id = metaId ?? opts?.manualId;
      if (id) {
        if (registry$1.components.callbacks.ids.has(id))
          throw new Error(`Callback "${id}" at ${path.join(" > ")} is already registered`);
        const ref = { $ref: `#/components/callbacks/${id}` };
        registry$1.components.callbacks.ids.set(id, callbackObject);
        registry$1.components.callbacks.seen.set(callback, ref);
        if (opts?.manualId)
          return callbackObject;
        return ref;
      }
      registry$1.components.callbacks.seen.set(callback, callbackObject);
      return callbackObject;
    },
    addSecurityScheme: (securityScheme, path, opts) => {
      const seenSecurityScheme = registry$1.components.securitySchemes.seen.get(securityScheme);
      if (seenSecurityScheme)
        return seenSecurityScheme;
      const { id: metaId, ...rest } = securityScheme;
      const securitySchemeObject = rest;
      const id = metaId ?? opts?.manualId;
      if (id) {
        if (registry$1.components.securitySchemes.ids.has(id))
          throw new Error(`SecurityScheme "${id}" at ${path.join(" > ")} is already registered`);
        const ref = { $ref: `#/components/securitySchemes/${id}` };
        registry$1.components.securitySchemes.ids.set(id, securitySchemeObject);
        registry$1.components.securitySchemes.seen.set(securityScheme, ref);
        if (opts?.manualId)
          return securitySchemeObject;
        return ref;
      }
      registry$1.components.securitySchemes.seen.set(securityScheme, securitySchemeObject);
      return securitySchemeObject;
    },
    addLink: (link, path, opts) => {
      const seenLink = registry$1.components.links.seen.get(link);
      if (seenLink)
        return seenLink;
      const { id: metaId, ...rest } = link;
      const linkObject = rest;
      const id = metaId ?? opts?.manualId;
      if (id) {
        if (registry$1.components.links.ids.has(id))
          throw new Error(`Link "${id}" at ${path.join(" > ")} is already registered`);
        const ref = { $ref: `#/components/links/${id}` };
        registry$1.components.links.ids.set(id, linkObject);
        registry$1.components.links.seen.set(link, ref);
        if (opts?.manualId)
          return linkObject;
        return ref;
      }
      registry$1.components.links.seen.set(link, linkObject);
      return linkObject;
    },
    addExample: (example, path, opts) => {
      const seenExample = registry$1.components.examples.seen.get(example);
      if (seenExample)
        return seenExample;
      const { id: metaId, ...rest } = example;
      const exampleObject = rest;
      const id = metaId ?? opts?.manualId;
      if (id) {
        if (registry$1.components.examples.ids.has(id))
          throw new Error(`Example "${id}" at ${path.join(" > ")} is already registered`);
        const ref = { $ref: `#/components/examples/${id}` };
        registry$1.components.examples.ids.set(id, exampleObject);
        registry$1.components.examples.seen.set(example, ref);
        if (opts?.manualId)
          return exampleObject;
        return ref;
      }
      registry$1.components.examples.seen.set(example, exampleObject);
      return exampleObject;
    }
  };
  registerSchemas(components?.schemas, registry$1);
  registerParameters(components?.parameters, registry$1);
  registerHeaders(components?.headers, registry$1);
  registerResponses(components?.responses, registry$1);
  registerPathItems(components?.pathItems, registry$1);
  registerRequestBodies(components?.requestBodies, registry$1);
  registerCallbacks(components?.callbacks, registry$1);
  registerSecuritySchemes(components?.securitySchemes, registry$1);
  registerLinks(components?.links, registry$1);
  registerExamples(components?.examples, registry$1);
  return registry$1;
};
var registerSchemas = (schemas3, registry$1) => {
  if (!schemas3)
    return;
  for (const [key, schema] of Object.entries(schemas3)) {
    if (isAnyZodType(schema)) {
      const id = globalRegistry.get(schema)?.id ?? key;
      registry$1.components.schemas.manual.set(id, {
        input: { schemaObject: {} },
        output: { schemaObject: {} },
        zodType: schema
      });
      continue;
    }
    registry$1.components.schemas.ids.set(key, schema);
  }
};
var registerParameters = (parameters, registry$1) => {
  if (!parameters)
    return;
  for (const [key, schema] of Object.entries(parameters)) {
    if (isAnyZodType(schema)) {
      const path = [
        "components",
        "parameters",
        key
      ];
      registry$1.addParameter(schema, path, { manualId: key });
      continue;
    }
    registry$1.components.parameters.ids.set(key, schema);
  }
};
var registerHeaders = (headers, registry$1) => {
  if (!headers)
    return;
  for (const [key, schema] of Object.entries(headers)) {
    if (isAnyZodType(schema)) {
      const path = [
        "components",
        "headers",
        key
      ];
      registry$1.addHeader(schema, path, { manualId: key });
      continue;
    }
    registry$1.components.headers.ids.set(key, schema);
  }
};
var registerResponses = (responses, registry$1) => {
  if (!responses)
    return;
  for (const [key, schema] of Object.entries(responses)) {
    const responseObject = registry$1.addResponse(schema, [
      "components",
      "responses",
      key
    ], { manualId: key });
    registry$1.components.responses.ids.set(key, responseObject);
    registry$1.components.responses.seen.set(schema, responseObject);
  }
};
var registerRequestBodies = (requestBodies, registry$1) => {
  if (!requestBodies)
    return;
  for (const [key, schema] of Object.entries(requestBodies)) {
    if (isAnyZodType(schema)) {
      registry$1.addRequestBody(schema, [
        "components",
        "requestBodies",
        key
      ], { manualId: key });
      continue;
    }
    registry$1.components.requestBodies.ids.set(key, schema);
  }
};
var registerCallbacks = (callbacks, registry$1) => {
  if (!callbacks)
    return;
  for (const [key, schema] of Object.entries(callbacks))
    registry$1.addCallback(schema, [
      "components",
      "callbacks",
      key
    ], { manualId: key });
};
var registerPathItems = (pathItems, registry$1) => {
  if (!pathItems)
    return;
  for (const [key, schema] of Object.entries(pathItems))
    registry$1.addPathItem(schema, [
      "components",
      "pathItems",
      key
    ], { manualId: key });
};
var registerSecuritySchemes = (securitySchemes, registry$1) => {
  if (!securitySchemes)
    return;
  for (const [key, schema] of Object.entries(securitySchemes))
    registry$1.addSecurityScheme(schema, [
      "components",
      "securitySchemes",
      key
    ], { manualId: key });
};
var registerLinks = (links, registry$1) => {
  if (!links)
    return;
  for (const [key, schema] of Object.entries(links))
    registry$1.addLink(schema, [
      "components",
      "links",
      key
    ], { manualId: key });
};
var registerExamples = (examples, registry$1) => {
  if (!examples)
    return;
  for (const [key, schema] of Object.entries(examples))
    registry$1.components.examples.ids.set(key, schema);
};
var createIOSchemas = (ctx) => {
  const { schemas: schemas3, components, manual } = createSchemas(Object.fromEntries(ctx.registry.components.schemas[ctx.io]), ctx);
  for (const [key, schema] of Object.entries(components))
    ctx.registry.components.schemas.ids.set(key, schema);
  for (const [key, schema] of Object.entries(schemas3)) {
    const ioSchema = ctx.registry.components.schemas[ctx.io].get(key);
    if (ioSchema)
      Object.assign(ioSchema.schemaObject, schema);
  }
  for (const [key, value] of Object.entries(manual)) {
    const manualSchema = ctx.registry.components.schemas.manual.get(key);
    if (!manualSchema)
      continue;
    if (components[key])
      manualSchema[ctx.io].used = true;
    Object.assign(manualSchema[ctx.io].schemaObject, value);
  }
};
var createManualSchemas = (registry$1) => {
  for (const [key, value] of registry$1.components.schemas.manual)
    if (!value.input.used) {
      const io = globalRegistry.get(value.zodType)?.unusedIO ?? "output";
      const schema = value[io].schemaObject;
      registry$1.components.schemas.ids.set(key, schema);
    }
};
var createComponents = (registry$1, opts, openapiVersion) => {
  createIOSchemas({
    registry: registry$1,
    io: "input",
    opts,
    openapiVersion
  });
  createIOSchemas({
    registry: registry$1,
    io: "output",
    opts,
    openapiVersion
  });
  createManualSchemas(registry$1);
  const components = {};
  if (registry$1.components.schemas.ids.size > 0)
    components.schemas = Object.fromEntries(registry$1.components.schemas.ids);
  if (registry$1.components.headers.ids.size > 0)
    components.headers = Object.fromEntries(registry$1.components.headers.ids);
  if (registry$1.components.requestBodies.ids.size > 0)
    components.requestBodies = Object.fromEntries(registry$1.components.requestBodies.ids);
  if (registry$1.components.responses.ids.size > 0)
    components.responses = Object.fromEntries(registry$1.components.responses.ids);
  if (registry$1.components.parameters.ids.size > 0)
    components.parameters = Object.fromEntries(registry$1.components.parameters.ids);
  if (registry$1.components.callbacks.ids.size > 0)
    components.callbacks = Object.fromEntries(registry$1.components.callbacks.ids);
  if (registry$1.components.pathItems.ids.size > 0)
    components.pathItems = Object.fromEntries(registry$1.components.pathItems.ids);
  if (registry$1.components.securitySchemes.ids.size > 0)
    components.securitySchemes = Object.fromEntries(registry$1.components.securitySchemes.ids);
  if (registry$1.components.links.ids.size > 0)
    components.links = Object.fromEntries(registry$1.components.links.ids);
  if (registry$1.components.examples.ids.size > 0)
    components.examples = Object.fromEntries(registry$1.components.examples.ids);
  return components;
};

// node_modules/zod-openapi/dist/index.js
var createDocument = (zodOpenApiObject, opts = {}) => {
  const { paths, webhooks, components, ...rest } = zodOpenApiObject;
  const document = rest;
  const registry2 = createRegistry(components);
  const createdPaths = createPaths(paths, registry2, ["paths"]);
  if (createdPaths)
    document.paths = createdPaths;
  const createdWebhooks = createPaths(webhooks, registry2, ["webhooks"]);
  if (createdWebhooks)
    document.webhooks = createdWebhooks;
  const createdComponents = createComponents(registry2, opts, zodOpenApiObject.openapi);
  if (Object.keys(createdComponents).length > 0)
    document.components = createdComponents;
  return document;
};

// src/index.ts
function toHeaderObject(headers) {
  const obj = {};
  headers.forEach((value, key) => {
    obj[key.toLowerCase()] = value;
  });
  return obj;
}
function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader)
    return out;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (!k)
      continue;
    out[k] = decodeURIComponent(rest.join("="));
  }
  return out;
}
function parseQuery(searchParams, schema) {
  const out = {};
  for (const [k, v] of searchParams.entries()) {
    if (k in out) {
      const existing = out[k];
      if (Array.isArray(existing))
        out[k] = [...existing, v];
      else
        out[k] = [existing, v];
    } else
      out[k] = v;
  }
  if (schema) {
    return schema.parse ? schema.parse(out) : out;
  }
  return out;
}
function formDataToObject(fd) {
  const obj = {};
  for (const [key, value] of fd.entries()) {
    if (key in obj) {
      const existing = obj[key];
      if (Array.isArray(existing))
        obj[key] = [...existing, value];
      else
        obj[key] = [existing, value];
    } else
      obj[key] = value;
  }
  return obj;
}
function buildMatcher(path) {
  if (!path.includes(":") && !path.includes("*"))
    return { regex: null, names: [] };
  const names = [];
  const pattern = path.split("/").map((seg, idx, arr) => {
    if (!seg)
      return "";
    if (seg.startsWith(":")) {
      names.push(seg.slice(1));
      return "([^/]+)";
    }
    if (seg.startsWith("*")) {
      const name = seg.slice(1) || "wildcard";
      names.push(name);
      return idx === arr.length - 1 ? "(.*)" : "(.*)";
    }
    return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("/");
  const regex = new RegExp(`^${pattern}$`);
  return { regex, names };
}
function mergeHeaders(base, extra) {
  const h = new Headers(base);
  for (const [k, v] of Object.entries(extra))
    h.set(k, v);
  return h;
}
function toResponse(body, init) {
  if (body instanceof Response)
    return new Response(body.body, { headers: mergeHeaders(body.headers, {}), status: body.status, statusText: body.statusText });
  if (typeof body === "string" || body instanceof Uint8Array || body instanceof ArrayBuffer || body instanceof Blob || body instanceof ReadableStream) {
    return new Response(body, init);
  }
  return new Response(String(body), init);
}

class BXO {
  routes = [];
  serveOptions;
  constructor(options) {
    this.serveOptions = options?.serve ?? {};
  }
  use(plugin) {
    this.routes.push(...plugin.routes);
    return this;
  }
  get(path, handler, schema) {
    return this.add("GET", path, handler, schema);
  }
  post(path, handler, schema) {
    return this.add("POST", path, handler, schema);
  }
  put(path, handler, schema) {
    return this.add("PUT", path, handler, schema);
  }
  patch(path, handler, schema) {
    return this.add("PATCH", path, handler, schema);
  }
  delete(path, handler, schema) {
    return this.add("DELETE", path, handler, schema);
  }
  default(path, arg2, schema) {
    return this.add("DEFAULT", path, arg2, schema);
  }
  start() {
    const nativeRoutes = {};
    for (const r of this.routes) {
      if (r.matcher === null) {
        switch (r.method) {
          case "DEFAULT":
            nativeRoutes[r.path] = r.handler;
            break;
          default:
            nativeRoutes[r.path] ||= {};
            nativeRoutes[r.path][r.method] = (req) => this.dispatch(r, req);
            break;
        }
      }
    }
    const server = Bun.serve({
      ...this.serveOptions,
      routes: nativeRoutes,
      fetch: (req) => this.dispatchAny(req, nativeRoutes)
    });
    const port = server.port ?? this.serveOptions.port ?? 3000;
  }
  add(method, path, handler, schema) {
    const { regex, names } = buildMatcher(path);
    this.routes.push({ method, path, handler, matcher: regex, paramNames: names, schema });
    return this;
  }
  async dispatch(route, req) {
    const url = new URL(req.url);
    const params = this.extractParams(route, url.pathname);
    let queryObj;
    let bodyObj = undefined;
    const cookieObj = parseCookies(req.headers.get("cookie"));
    const headerObj = toHeaderObject(req.headers);
    try {
      queryObj = route.schema?.query ? parseQuery(url.searchParams, route.schema.query) : parseQuery(url.searchParams);
    } catch (err) {
      const payload = err?.issues ? { error: "Validation Error", issues: err.issues } : { error: "Validation Error" };
      return new Response(JSON.stringify(payload), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    try {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const raw = await req.json();
        bodyObj = route.schema?.body ? route.schema.body.parse(raw) : raw;
      } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
        const fd = await req.formData();
        const raw = formDataToObject(fd);
        bodyObj = route.schema?.body ? route.schema.body.parse(raw) : raw;
      } else if (contentType.includes("text/")) {
        const raw = await req.text();
        bodyObj = route.schema?.body ? route.schema.body.parse(raw) : raw;
      } else if (contentType) {
        const raw = await req.arrayBuffer();
        bodyObj = route.schema?.body ? route.schema.body.parse(raw) : raw;
      } else {
        try {
          const raw = await req.json();
          bodyObj = route.schema?.body ? route.schema.body.parse(raw) : raw;
        } catch {
          try {
            const raw = await req.text();
            bodyObj = route.schema?.body ? route.schema.body.parse(raw) : raw;
          } catch {
            bodyObj = undefined;
          }
        }
      }
      if (!bodyObj && route.schema?.body) {
        return new Response(JSON.stringify({ error: "Body is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
    } catch (err) {
      const payload = err?.issues ? { error: "Validation Error", issues: err.issues } : { error: "Validation Error" };
      return new Response(JSON.stringify(payload), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const ctx = {
      request: req,
      params,
      query: queryObj,
      headers: headerObj,
      cookies: cookieObj,
      body: bodyObj,
      set: { headers: {} },
      json: (data, status = 200) => {
        if (route.schema?.response?.[status]) {
          const sch = route.schema.response[status];
          const res = sch.safeParse ? sch.safeParse(data) : { success: true };
          if (!res.success) {
            return new Response(JSON.stringify({ error: "Invalid response", issues: res.error?.issues ?? [] }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
        }
        const headers = mergeHeaders({ "Content-Type": "application/json" }, ctx.set.headers);
        return new Response(JSON.stringify(data), { status, headers });
      },
      text: (data, status = 200) => {
        if (route.schema?.response?.[status]) {
          const sch = route.schema.response[status];
          const res = sch.safeParse ? sch.safeParse(data) : { success: true };
          if (!res.success) {
            return new Response(JSON.stringify({ error: "Invalid response", issues: res.error?.issues ?? [] }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
        }
        const headers = mergeHeaders({ "Content-Type": "text/plain" }, ctx.set.headers);
        return new Response(data, { status, headers });
      }
    };
    if (route.schema) {
      try {
        if (route.schema.headers) {
          route.schema.headers.parse(headerObj);
        }
        if (route.schema.cookies) {
          route.schema.cookies.parse(cookieObj);
        }
      } catch (err) {
        const payload = err?.issues ? { error: "Validation Error", issues: err.issues } : { error: "Validation Error" };
        return new Response(JSON.stringify(payload), { status: 400, headers: { "Content-Type": "application/json" } });
      }
    }
    const result = await route.handler(ctx, this);
    const resp = toResponse(result);
    const merged = new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: mergeHeaders(resp.headers, ctx.set.headers)
    });
    return merged;
  }
  async dispatchAny(req, nativeRoutes) {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();
    const exact = nativeRoutes[url.pathname];
    if (exact) {
      const h = exact[method] || exact["DEFAULT"];
      if (h)
        return await h(req);
    }
    for (const r of this.routes) {
      if (r.matcher === null)
        continue;
      if (r.method !== method && r.method !== "DEFAULT")
        continue;
      const m = url.pathname.match(r.matcher);
      if (m)
        return this.dispatch(r, req);
    }
    return new Response("Not Found", { status: 404 });
  }
  extractParams(route, pathname) {
    if (!route.matcher)
      return {};
    const match = pathname.match(route.matcher);
    if (!match)
      return {};
    const params = {};
    for (let i = 0;i < route.paramNames.length; i++) {
      const name = route.paramNames[i];
      const value = match[i + 1] ?? "";
      params[name] = decodeURIComponent(value);
    }
    return params;
  }
}

// plugins/openapi.ts
var routeRegistry = [];
function registerRoute(metadata) {
  routeRegistry.push(metadata);
}
function createSafeSchema(schema) {
  try {
    if (schema && typeof schema === "object") {
      if (schema._def) {
        const def = schema._def;
        if (def.typeName === "ZodString") {
          return { type: "string" };
        } else if (def.typeName === "ZodNumber") {
          return { type: "number" };
        } else if (def.typeName === "ZodBoolean") {
          return { type: "boolean" };
        } else if (def.typeName === "ZodObject") {
          return { type: "object" };
        } else if (def.typeName === "ZodArray") {
          return { type: "array" };
        } else if (def.typeName === "ZodInstanceof" && def.constructor === File) {
          return {
            type: "string",
            format: "binary",
            description: "File upload"
          };
        }
      }
    }
    return {
      type: "string",
      description: "Custom type - see schema definition"
    };
  } catch (error2) {
    return {
      type: "string",
      description: "Custom type - see schema definition"
    };
  }
}
function openapi(config2 = {
  openapi: "3.1.0",
  info: {
    title: "BXO API",
    version: "1.0.0",
    description: "API documentation generated by BXO"
  }
}) {
  const bxo = new BXO;
  bxo.get("/openapi.json", () => {
    const openAPIDoc = generateOpenAPIDoc(config2);
    return new Response(JSON.stringify(openAPIDoc), {
      headers: { "Content-Type": "application/json" }
    });
  });
  bxo.get("/docs", () => {
    return new Response(generateSwaggerUI(config2.info.title), {
      headers: { "Content-Type": "text/html" }
    });
  });
  return bxo;
}
function generateOpenAPIDoc(config2) {
  const paths = {};
  const schemas3 = {};
  for (const route of routeRegistry) {
    const pathKey = route.path;
    if (!paths[pathKey]) {
      paths[pathKey] = {};
    }
    const method = route.method.toLowerCase();
    const operation = {
      responses: {
        "200": {
          description: "Success",
          content: {
            "application/json": {
              schema: route.schema?.response?.[200] ? createSafeSchema(route.schema.response[200]) : { type: "string" }
            }
          }
        }
      }
    };
    if (route.schema?.detail) {
      if (route.schema.detail.description) {
        operation.description = route.schema.detail.description;
      }
      if (route.schema.detail.summary) {
        operation.summary = route.schema.detail.summary;
      }
      if (route.schema.detail.tags) {
        operation.tags = route.schema.detail.tags;
      }
    }
    if (route.schema?.query) {
      operation.parameters = operation.parameters || [];
      const querySchema = route.schema.query;
      if (querySchema && typeof querySchema === "object" && "shape" in querySchema) {
        try {
          const shape = querySchema.shape();
          for (const [key, schema] of Object.entries(shape)) {
            operation.parameters.push({
              in: "query",
              name: key,
              required: true,
              schema: createSafeSchema(schema)
            });
          }
        } catch (e) {
          operation.parameters.push({
            in: "query",
            name: "query",
            required: true,
            schema: createSafeSchema(querySchema)
          });
        }
      }
    }
    if (route.schema?.body) {
      const contentTypes = route.schema.detail?.requestBodyContentTypes || ["application/json"];
      operation.requestBody = {
        content: {}
      };
      for (const contentType of contentTypes) {
        operation.requestBody.content[contentType] = {
          schema: createSafeSchema(route.schema.body)
        };
      }
    }
    if (route.path.includes(":")) {
      const pathParams = route.path.match(/:[^/]+/g);
      if (pathParams) {
        operation.parameters = operation.parameters || [];
        pathParams.forEach((param) => {
          const paramName = param.slice(1);
          operation.parameters.push({
            in: "path",
            name: paramName,
            required: true,
            schema: { type: "string" }
          });
        });
      }
    }
    paths[pathKey][method] = operation;
  }
  return createDocument({
    openapi: config2.openapi || "3.1.0",
    info: config2.info,
    servers: config2.servers || [{ url: "http://localhost:3000" }],
    tags: config2.tags || [],
    paths,
    components: {
      ...config2.components,
      schemas: schemas3
    },
    security: config2.security || []
  });
}
function generateSwaggerUI(title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/openapi.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>`;
}
export {
  registerRoute,
  openapi as default
};
