(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /**
     * @this {Promise}
     */
    function finallyConstructor(callback) {
      var constructor = this.constructor;
      return this.then(
        function(value) {
          return constructor.resolve(callback()).then(function() {
            return value;
          });
        },
        function(reason) {
          return constructor.resolve(callback()).then(function() {
            return constructor.reject(reason);
          });
        }
      );
    }

    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;

    function noop() {}

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
      return function() {
        fn.apply(thisArg, arguments);
      };
    }

    /**
     * @constructor
     * @param {Function} fn
     */
    function Promise$1(fn) {
      if (!(this instanceof Promise$1))
        throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      /** @type {!number} */
      this._state = 0;
      /** @type {!boolean} */
      this._handled = false;
      /** @type {Promise|undefined} */
      this._value = undefined;
      /** @type {!Array<!Function>} */
      this._deferreds = [];

      doResolve(fn, this);
    }

    function handle(self, deferred) {
      while (self._state === 3) {
        self = self._value;
      }
      if (self._state === 0) {
        self._deferreds.push(deferred);
        return;
      }
      self._handled = true;
      Promise$1._immediateFn(function() {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
          return;
        }
        var ret;
        try {
          ret = cb(self._value);
        } catch (e) {
          reject(deferred.promise, e);
          return;
        }
        resolve(deferred.promise, ret);
      });
    }

    function resolve(self, newValue) {
      try {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self)
          throw new TypeError('A promise cannot be resolved with itself.');
        if (
          newValue &&
          (typeof newValue === 'object' || typeof newValue === 'function')
        ) {
          var then = newValue.then;
          if (newValue instanceof Promise$1) {
            self._state = 3;
            self._value = newValue;
            finale(self);
            return;
          } else if (typeof then === 'function') {
            doResolve(bind(then, newValue), self);
            return;
          }
        }
        self._state = 1;
        self._value = newValue;
        finale(self);
      } catch (e) {
        reject(self, e);
      }
    }

    function reject(self, newValue) {
      self._state = 2;
      self._value = newValue;
      finale(self);
    }

    function finale(self) {
      if (self._state === 2 && self._deferreds.length === 0) {
        Promise$1._immediateFn(function() {
          if (!self._handled) {
            Promise$1._unhandledRejectionFn(self._value);
          }
        });
      }

      for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
      }
      self._deferreds = null;
    }

    /**
     * @constructor
     */
    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.promise = promise;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, self) {
      var done = false;
      try {
        fn(
          function(value) {
            if (done) return;
            done = true;
            resolve(self, value);
          },
          function(reason) {
            if (done) return;
            done = true;
            reject(self, reason);
          }
        );
      } catch (ex) {
        if (done) return;
        done = true;
        reject(self, ex);
      }
    }

    Promise$1.prototype['catch'] = function(onRejected) {
      return this.then(null, onRejected);
    };

    Promise$1.prototype.then = function(onFulfilled, onRejected) {
      // @ts-ignore
      var prom = new this.constructor(noop);

      handle(this, new Handler(onFulfilled, onRejected, prom));
      return prom;
    };

    Promise$1.prototype['finally'] = finallyConstructor;

    Promise$1.all = function(arr) {
      return new Promise$1(function(resolve, reject) {
        if (!arr || typeof arr.length === 'undefined')
          throw new TypeError('Promise.all accepts an array');
        var args = Array.prototype.slice.call(arr);
        if (args.length === 0) return resolve([]);
        var remaining = args.length;

        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(
                  val,
                  function(val) {
                    res(i, val);
                  },
                  reject
                );
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }

        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };

    Promise$1.resolve = function(value) {
      if (value && typeof value === 'object' && value.constructor === Promise$1) {
        return value;
      }

      return new Promise$1(function(resolve) {
        resolve(value);
      });
    };

    Promise$1.reject = function(value) {
      return new Promise$1(function(resolve, reject) {
        reject(value);
      });
    };

    Promise$1.race = function(values) {
      return new Promise$1(function(resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };

    // Use polyfill for setImmediate for performance gains
    Promise$1._immediateFn =
      (typeof setImmediate === 'function' &&
        function(fn) {
          setImmediate(fn);
        }) ||
      function(fn) {
        setTimeoutFunc(fn, 0);
      };

    Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
      if (typeof console !== 'undefined' && console) {
        console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
      }
    };

    /** @suppress {undefinedVars} */
    var globalNS = (function() {
      // the only reliable means to get the global object is
      // `Function('return this')()`
      // However, this causes CSP violations in Chrome apps.
      if (typeof self !== 'undefined') {
        return self;
      }
      if (typeof window !== 'undefined') {
        return window;
      }
      if (typeof global !== 'undefined') {
        return global;
      }
      throw new Error('unable to locate global object');
    })();

    if (!('Promise' in globalNS)) {
      globalNS['Promise'] = Promise$1;
    } else if (!globalNS.Promise.prototype['finally']) {
      globalNS.Promise.prototype['finally'] = finallyConstructor;
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var fetch_umd = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      factory(exports);
    }(commonjsGlobal, (function (exports) {
      var support = {
        searchParams: 'URLSearchParams' in self,
        iterable: 'Symbol' in self && 'iterator' in Symbol,
        blob:
          'FileReader' in self &&
          'Blob' in self &&
          (function() {
            try {
              new Blob();
              return true
            } catch (e) {
              return false
            }
          })(),
        formData: 'FormData' in self,
        arrayBuffer: 'ArrayBuffer' in self
      };

      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
      }

      if (support.arrayBuffer) {
        var viewClasses = [
          '[object Int8Array]',
          '[object Uint8Array]',
          '[object Uint8ClampedArray]',
          '[object Int16Array]',
          '[object Uint16Array]',
          '[object Int32Array]',
          '[object Uint32Array]',
          '[object Float32Array]',
          '[object Float64Array]'
        ];

        var isArrayBufferView =
          ArrayBuffer.isView ||
          function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
          };
      }

      function normalizeName(name) {
        if (typeof name !== 'string') {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
      }

      function normalizeValue(value) {
        if (typeof value !== 'string') {
          value = String(value);
        }
        return value
      }

      // Build a destructive iterator for the value list
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return {done: value === undefined, value: value}
          }
        };

        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator
          };
        }

        return iterator
      }

      function Headers(headers) {
        this.map = {};

        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }

      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ', ' + value : value;
      };

      Headers.prototype['delete'] = function(name) {
        delete this.map[normalizeName(name)];
      };

      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null
      };

      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name))
      };

      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };

      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };

      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items)
      };

      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items)
      };

      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items)
      };

      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }

      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true;
      }

      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        })
      }

      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise
      }

      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise
      }

      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);

        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join('')
      }

      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0)
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer
        }
      }

      function Body() {
        this.bodyUsed = false;

        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = '';
          } else if (typeof body === 'string') {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            // IE 10-11 can't handle a DataView body.
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }

          if (!this.headers.get('content-type')) {
            if (typeof body === 'string') {
              this.headers.set('content-type', 'text/plain;charset=UTF-8');
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set('content-type', this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
          }
        };

        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected
            }

            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob)
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]))
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as blob')
            } else {
              return Promise.resolve(new Blob([this._bodyText]))
            }
          };

          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
            } else {
              return this.blob().then(readBlobAsArrayBuffer)
            }
          };
        }

        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected
          }

          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text')
          } else {
            return Promise.resolve(this._bodyText)
          }
        };

        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode)
          };
        }

        this.json = function() {
          return this.text().then(JSON.parse)
        };

        return this
      }

      // HTTP methods whose capitalization should be normalized
      var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method
      }

      function Request(input, options) {
        options = options || {};
        var body = options.body;

        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError('Already read')
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }

        this.credentials = options.credentials || this.credentials || 'same-origin';
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || 'GET');
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
          throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body);
      }

      Request.prototype.clone = function() {
        return new Request(this, {body: this._bodyInit})
      };

      function decode(body) {
        var form = new FormData();
        body
          .trim()
          .split('&')
          .forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split('=');
              var name = split.shift().replace(/\+/g, ' ');
              var value = split.join('=').replace(/\+/g, ' ');
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
        return form
      }

      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(':');
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(':').trim();
            headers.append(key, value);
          }
        });
        return headers
      }

      Body.call(Request.prototype);

      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }

        this.type = 'default';
        this.status = options.status === undefined ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = 'statusText' in options ? options.statusText : 'OK';
        this.headers = new Headers(options.headers);
        this.url = options.url || '';
        this._initBody(bodyInit);
      }

      Body.call(Response.prototype);

      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        })
      };

      Response.error = function() {
        var response = new Response(null, {status: 0, statusText: ''});
        response.type = 'error';
        return response
      };

      var redirectStatuses = [301, 302, 303, 307, 308];

      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError('Invalid status code')
        }

        return new Response(null, {status: status, headers: {location: url}})
      };

      exports.DOMException = self.DOMException;
      try {
        new exports.DOMException();
      } catch (err) {
        exports.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports.DOMException.prototype = Object.create(Error.prototype);
        exports.DOMException.prototype.constructor = exports.DOMException;
      }

      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);

          if (request.signal && request.signal.aborted) {
            return reject(new exports.DOMException('Aborted', 'AbortError'))
          }

          var xhr = new XMLHttpRequest();

          function abortXhr() {
            xhr.abort();
          }

          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || '')
            };
            options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
            var body = 'response' in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };

          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.ontimeout = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.onabort = function() {
            reject(new exports.DOMException('Aborted', 'AbortError'));
          };

          xhr.open(request.method, request.url, true);

          if (request.credentials === 'include') {
            xhr.withCredentials = true;
          } else if (request.credentials === 'omit') {
            xhr.withCredentials = false;
          }

          if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob';
          }

          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });

          if (request.signal) {
            request.signal.addEventListener('abort', abortXhr);

            xhr.onreadystatechange = function() {
              // DONE (success or failure)
              if (xhr.readyState === 4) {
                request.signal.removeEventListener('abort', abortXhr);
              }
            };
          }

          xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
        })
      }

      fetch.polyfill = true;

      if (!self.fetch) {
        self.fetch = fetch;
        self.Headers = Headers;
        self.Request = Request;
        self.Response = Response;
      }

      exports.Headers = Headers;
      exports.Request = Request;
      exports.Response = Response;
      exports.fetch = fetch;

      Object.defineProperty(exports, '__esModule', { value: true });

    })));
    });

    unwrapExports(fetch_umd);

    function isChildren(x) {
        return !x.pop;
    }
    function h(name, attributes) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        var ch = [];
        rest.reverse();
        while (rest.length) {
            var nod = rest.pop();
            if (nod && !isChildren(nod)) {
                for (var i = nod.length - 1; i >= 0; i--) {
                    rest.push(nod[i]);
                }
            }
            else if (nod != null && nod !== true && nod !== false) {
                ch.push(nod);
            }
        }
        if (typeof name === "function") {
            return name(attributes || {}, ch);
        }
        var node = {
            attributes: attributes || {},
            children: ch,
            key: attributes && attributes.key,
            nodeName: name,
        };
        return node;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics$1 = function(d, b) {
        extendStatics$1 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
        extendStatics$1(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * Creates Proxy that calls `after` callback after set or delete entries of a `target`.
     *
     *
     * @param target target object
     * @param after callback to execute after set or delete entries of `target`
     */
    function make(target, after) {
        return new Proxy(target, {
            set: function (t, k, v) {
                if (k in t && t[k] === v) {
                    return true;
                }
                t[k] = v;
                after();
                return true;
            },
            deleteProperty: function (t, k) {
                if (k in t) {
                    delete t[k];
                    after();
                }
                return true;
            },
        });
    }
    /**
     * Creates Proxy that calls `after` callback after set or delete entries of a `target`.
     * Set or delete actions can be (re, un)done using `redoundo.Hist` argument.
     *
     * @param target target object
     * @param after callback to execute after set or delete entries of `target`
     * @param hist `redoundo.Hist` object
     */
    function makeH(target, after, hist) {
        if (!hist) {
            return null;
        }
        return new Proxy(target, {
            set: function (t, k, v) {
                var was = k in target;
                var oldVal = null;
                if (was) {
                    oldVal = target[k];
                    if (oldVal === v) {
                        return true;
                    }
                }
                var redo = function () {
                    target[k] = v;
                    after();
                };
                var undo = function () {
                    if (was) {
                        target[k] = oldVal;
                    }
                    else {
                        delete target[k];
                    }
                    after();
                };
                hist.add({ Redo: redo, Undo: undo });
                return true;
            },
            deleteProperty: function (t, k) {
                if (!(k in t)) {
                    return true;
                }
                var v = t[k];
                var redo = function () {
                    delete t[k];
                    after();
                };
                var undo = function () {
                    t[k] = v;
                    after();
                };
                hist.add({ Redo: redo, Undo: undo });
                return true;
            },
        });
    }

    /** Class of `hyperoop` top-level actions. When you properly set new values
     *  to entries of the `State` property then the corresponding DOM element will
     *  be redrawn automatically. The correspondence between `Actions` object
     *  and this DOM element is established by `init` function call.
     */
    var Actions = /** @class */ (function () {
        /** Construct an `Action` object, setting the initial `state` to it and optionally describing
         *  the `hist` object of type `redoundo.Hist`.
         */
        function Actions(start, hist) {
            this.orig = start;
            this.History = hist;
            this.init({ scheduleRender: function () { return null; } });
        }
        Object.defineProperty(Actions.prototype, "State", {
            /** This property, along with the `Remember` property, is used to change
             *  the state of an application and automatically redraw the user interface.
             */
            get: function () { return this.state; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Actions.prototype, "Remember", {
            /** This property has almost the same functionality as the `State` property,
             *  with the difference that changes made to it can be undone by calling the
             *  `History.undo` method.
             */
            get: function () { return this.remember; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Actions.prototype, "Renderer", {
            /** You can force redraw of the user interface by calling the `sheduleRender`
             *  method provided by this property. Usually you do not need to call it directly.
             */
            get: function () { return this.renderer; },
            enumerable: true,
            configurable: true
        });
        /** The page is redrawn automatically every time you set a new value for any entry of the `State`
         *  property. To set values for several inputs at once with only one automatic redraw, use
         *  this method, passing it a partial description of the new state and the optional parameter
         *  `remember` (`false` by default). If the value of the parameter `remember` is set to `true`, then
         *  the changes can be undone by calling `History.undo` method.
         */
        Actions.prototype.set = function (s, remember) {
            var _this = this;
            if (remember === void 0) { remember = false; }
            var keys;
            if (Array.isArray(s)) {
                keys = Array.from(s.keys());
            }
            else {
                keys = Object.getOwnPropertyNames(s);
            }
            keys = keys.filter(function (k) { return !(k in _this.orig) || _this.orig[k] !== s[k]; });
            var change = keys.length > 0;
            if (!change) {
                return;
            }
            var self = this;
            if (remember && this.History) {
                var was_1 = {};
                var wasnt_1 = [];
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var k = keys_1[_i];
                    if (k in this.orig) {
                        was_1[k] = this.orig[k];
                    }
                    else {
                        wasnt_1.push(k);
                    }
                }
                this.History.add({
                    Redo: function () {
                        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
                            var k = keys_3[_i];
                            self.orig[k] = s[k];
                        }
                        self.renderer.scheduleRender();
                    },
                    Undo: function () {
                        for (var k in was_1) {
                            self.orig[k] = was_1[k];
                        }
                        for (var _i = 0, wasnt_2 = wasnt_1; _i < wasnt_2.length; _i++) {
                            var k = wasnt_2[_i];
                            delete self.orig[k];
                        }
                        self.renderer.scheduleRender();
                    },
                });
            }
            else {
                for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                    var k = keys_2[_a];
                    this.orig[k] = s[k];
                }
                this.renderer.scheduleRender();
            }
        };
        /** This method is used to initialize the `Actions` object by an instance of the `IRenderer` interface.
         *  Usually you do not need to call it directly.
         */
        Actions.prototype.init = function (r) {
            this.renderer = r;
            var self = this;
            this.state = make(this.orig, function () { return self.renderer.scheduleRender(); });
            this.remember = makeH(this.orig, function () { return self.renderer.scheduleRender(); }, this.History);
        };
        return Actions;
    }());
    /** Usually, you only need to manually initialize top-level `Action` objects (by calling the `init` function).
     * This class is used for lower level action-objects that inherit the necessary properties from higher level
     * objects. Thus, you do not need to initialize the `SubActions` of the lower levels manually.
     */
    var SubActions = /** @class */ (function (_super) {
        __extends$1(SubActions, _super);
        /** Construct an `Action` object, setting the initial `state` and parental `Actions`
         *  object. The last will be used for initializing new instance by renderer and history objects.
         */
        function SubActions(start, parent) {
            var _this = _super.call(this, start, parent.History) || this;
            if (parent.Renderer) {
                _this.init({ scheduleRender: function () { return parent.Renderer.scheduleRender(); } });
            }
            return _this;
        }
        return SubActions;
    }(Actions));

    function isVNode(n) {
        return !!n.nodeName;
    }
    function clone(target, source) {
        var out = {};
        for (var i in target) {
            out[i] = target[i];
        }
        for (var i in source) {
            out[i] = source[i];
        }
        return out;
    }
    function elementToVNode(element) {
        return {
            attributes: {},
            children: [].map.call(element.childNodes, function (el) { return el.nodeType === 3 // Node.TEXT_NODE
                ? el.nodeValue
                : elementToVNode(el); }),
            nodeName: element.nodeName.toLowerCase(),
        };
    }
    function resolveNode(node) {
        return typeof node === "function"
            ? resolveNode(node())
            : node != null
                ? node
                : "";
    }
    function getKey(node) {
        return node && isVNode(node) ? node.key : null;
    }
    function eventListener(event) {
        return event.currentTarget.events[event.type](event);
    }
    function updateStyle(element, value, oldValue) {
        if (typeof value === "string") {
            element.style.cssText = value;
        }
        else {
            if (typeof oldValue === "string") {
                oldValue = element.style.cssText = "";
            }
            for (var key in clone(oldValue, value)) {
                var style = value == null || value[key] == null ? "" : value[key];
                if (key[0] === "-") {
                    element.style.setProperty(key, style);
                }
                else {
                    element.style[key] = style;
                }
            }
        }
    }
    function updateEventProperty(element, name, value, oldValue) {
        name = name.slice(2);
        if (element.events) {
            if (!oldValue) {
                oldValue = element.events[name];
            }
        }
        else {
            element.events = {};
        }
        element.events[name] = value;
        if (value) {
            if (!oldValue) {
                element.addEventListener(name, eventListener);
            }
        }
        else {
            element.removeEventListener(name, eventListener);
        }
    }
    var specialAttrNames = {
        draggable: 1,
        list: 1,
        spellcheck: 1,
        translate: 1,
        type: 1,
    };
    function updateAttribute(element, name, value, oldValue, isSvg) {
        if (name === "key") {
            return;
        }
        if (name === "style") {
            updateStyle(element, value, oldValue);
        }
        else {
            if (name[0] === "o" && name[1] === "n") {
                updateEventProperty(element, name, value, oldValue);
            }
            else if (name in element && !(name in specialAttrNames) && !isSvg) {
                element[name] = value == null ? "" : value;
            }
            else if (value != null && value !== false) {
                element.setAttribute(name, value);
            }
            if (value == null || value === false) {
                element.removeAttribute(name);
            }
        }
    }
    function removeChildren(element, node) {
        if (isVNode(node)) {
            var attributes = node.attributes;
            for (var i = 0; i < node.children.length; i++) {
                removeChildren(element.childNodes[i], node.children[i]);
            }
            if (attributes.ondestroy) {
                attributes.ondestroy(element);
            }
        }
        return element;
    }
    function removeElement(parent, element, node) {
        function done() {
            parent.removeChild(removeChildren(element, node));
        }
        var cb = isVNode(node) && node.attributes && node.attributes.onremove;
        if (cb) {
            cb(element, done);
        }
        else {
            done();
        }
    }
    var Renderer = /** @class */ (function () {
        function Renderer(container, view, action) {
            this.skipRender = false;
            this.isRecycling = true;
            this.lifecycle = [];
            this.container = container;
            this.view = view;
            this.rootElement = (container && container.children[0]) || null;
            this.oldNode = this.rootElement && elementToVNode(this.rootElement);
            this.action = action;
        }
        Renderer.prototype.render = function () {
            var _this = this;
            this.skipRender = !this.skipRender;
            var node = resolveNode(function () {
                if (_this.action) {
                    _this.action.init(_this);
                }
                return _this.view();
            });
            if (this.container && !this.skipRender) {
                this.rootElement = this.patch(this.container, this.rootElement, this.oldNode, (this.oldNode = node));
            }
            this.isRecycling = false;
            while (this.lifecycle.length) {
                this.lifecycle.pop()();
            }
            return node;
        };
        Renderer.prototype.scheduleRender = function () {
            if (!this.skipRender) {
                this.skipRender = true;
                setTimeout(this.render.bind(this));
            }
        };
        Renderer.prototype.createElement = function (node, isSvg) {
            var element = null;
            if (typeof node === "string" || typeof node === "number") {
                element = document.createTextNode("" + node);
            }
            else {
                isSvg = isSvg || node.nodeName === "svg";
                if (isSvg) {
                    element = document.createElementNS("http://www.w3.org/2000/svg", node.nodeName);
                }
                else {
                    element = document.createElement(node.nodeName);
                }
            }
            if (isVNode(node)) {
                var attributes_1 = node.attributes;
                if (attributes_1) {
                    if (attributes_1.oncreate) {
                        this.lifecycle.push(function () { return attributes_1.oncreate(element); });
                    }
                    for (var i = 0; i < node.children.length; i++) {
                        element.appendChild(this.createElement((node.children[i] = resolveNode(node.children[i])), isSvg));
                    }
                    for (var name_1 in attributes_1) {
                        updateAttribute(element, name_1, attributes_1[name_1], null, isSvg);
                    }
                }
            }
            return element;
        };
        Renderer.prototype.updateElement = function (element, oldAttributes, attributes, isSvg) {
            for (var name_2 in clone(oldAttributes, attributes)) {
                var needUpdate = attributes[name_2] !==
                    (name_2 === "value" || name_2 === "checked" ? element[name_2] : oldAttributes[name_2]);
                if (needUpdate) {
                    updateAttribute(element, name_2, attributes[name_2], oldAttributes[name_2], isSvg);
                }
            }
            var cb = this.isRecycling ? attributes.oncreate : attributes.onupdate;
            if (cb) {
                this.lifecycle.push(function () { return cb(element, oldAttributes); });
            }
        };
        Renderer.prototype.patchNewNode = function (parent, element, oldNode, node, isSvg) {
            var newElement = this.createElement(node, isSvg);
            parent.insertBefore(newElement, element);
            if (oldNode != null) {
                removeElement(parent, element, oldNode);
            }
            return newElement;
        };
        Renderer.prototype.patchChildren = function (element, oldNode, node, isSvg) {
            if (isSvg === void 0) { isSvg = false; }
            isSvg = isSvg || node.nodeName === "svg";
            this.updateElement(element, oldNode.attributes, node.attributes, isSvg);
            var oldKeyed = {};
            var newKeyed = {};
            var oldElements = [];
            var oldChildren = oldNode.children;
            var children = node.children;
            for (var j = 0; j < oldChildren.length; j++) {
                oldElements[j] = element.childNodes[j];
                var oldKey = getKey(oldChildren[j]);
                if (oldKey != null) {
                    oldKeyed[oldKey] = [oldElements[j], oldChildren[j]];
                }
            }
            var i = 0;
            var k = 0;
            while (k < children.length) {
                var oldKey = getKey(oldChildren[i]);
                var newKey = getKey((children[k] = resolveNode(children[k])));
                if (newKeyed[oldKey]) {
                    i++;
                    continue;
                }
                if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
                    if (oldKey == null) {
                        removeElement(element, oldElements[i], oldChildren[i]);
                    }
                    i++;
                    continue;
                }
                if (newKey == null || this.isRecycling) {
                    if (oldKey == null) {
                        this.patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
                        k++;
                    }
                    i++;
                }
                else {
                    var keyedNode = oldKeyed[newKey] || [];
                    if (oldKey === newKey) {
                        this.patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
                        i++;
                    }
                    else if (keyedNode[0]) {
                        var el = element.insertBefore(keyedNode[0], oldElements[i]);
                        this.patch(element, el, keyedNode[1], children[k], isSvg);
                    }
                    else {
                        this.patch(element, oldElements[i], null, children[k], isSvg);
                    }
                    newKeyed[newKey] = children[k];
                    k++;
                }
            }
            while (i < oldChildren.length) {
                if (getKey(oldChildren[i]) == null) {
                    removeElement(element, oldElements[i], oldChildren[i]);
                }
                i++;
            }
            for (var j in oldKeyed) {
                if (!newKeyed[j]) {
                    removeElement(element, oldKeyed[j][0], oldKeyed[j][1]);
                }
            }
            return element;
        };
        Renderer.prototype.patch = function (parent, element, oldNode, node, isSvg) {
            if (isSvg === void 0) { isSvg = false; }
            if (node === oldNode) {
                return element;
            }
            if (oldNode == null || (oldNode.nodeName !== node.nodeName)) {
                element = this.patchNewNode(parent, element, oldNode, node, isSvg);
            }
            else if ((!isVNode(oldNode) || oldNode.nodeName == null) && !isVNode(node)) {
                element.nodeValue = "" + node;
            }
            else if (isVNode(node) && isVNode(oldNode)) {
                element = this.patchChildren(element, oldNode, node, isSvg);
            }
            else {
                throw new Error("Mom, what this 'patch' wants???");
            }
            return element;
        };
        return Renderer;
    }());

    /** Initialize DOM element `container` with virtual node `view` and optional
     *  `Actions` object `actions`. Calling this function is the only and necessary
     *  method of attaching a virtual tree to a DOM element.
     */
    function init(container, view, action) {
        var renderer = new Renderer(container, view, action);
        renderer.scheduleRender();
        return renderer;
    }

    var ui = /*#__PURE__*/Object.freeze({
        init: init,
        h: h,
        Actions: Actions,
        SubActions: SubActions
    });

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign$1 = function() {
        __assign$1 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };

    var trimTrailingSlash = function (x) { return x.replace(/(.*)\/$/, "$1"); };

    var locationToString = function (loc) { return loc.pathname + loc.search + loc.hash; };
    var locString = function (to) {
        if (!to) {
            return ["#", null];
        }
        if (typeof to === "string") {
            return [to, null];
        }
        return ["" +
                (to.pathname ? trimTrailingSlash(to.pathname) : "") +
                (to.search ? (to.search[0] === "?" ? to.search : "?" + to.search) : "") +
                (to.hash ? (to.hash[0] === "#" ? to.hash : "#" + to.hash) : ""), to.state];
    };

    var jsxFactory = null;
    /** `Router` object that provides routing functionality to a `hyperoop` application */
    var Router = /** @class */ (function () {
        /** Constructor initializes `Router` with `rOwner` which is usually `hyperoop.Actions`
         *  object and `jsxf` which is usually just `hyperoop.h`.
         */
        function Router(rOwner, jsxf) {
            this.rOwner = rOwner;
            this.loc = locationToString(window.location);
            if (!jsxFactory) {
                jsxFactory = jsxf;
            }
            this.subscribe();
        }
        /** Go to a new location. Argument can be a `string` URL or `IToObject` */
        Router.prototype.go = function (t) {
            var _a = locString(t), to = _a[0], state = _a[1];
            if (to !== null && to !== locationToString(window.location)) {
                history.pushState(state, "", to);
            }
        };
        /** Stops a `Router` functionality, useful mainly for tests */
        Router.prototype.stop = function () { };
        Router.prototype.wrapHistory = function (keys) {
            this.unwrapHistory = keys.reduce(function (next, key) {
                var fn = history[key];
                history[key] = function (data, title, url) {
                    fn.bind(history)(data, title, url);
                    dispatchEvent(new CustomEvent("pushstate", { detail: data }));
                };
                return function () {
                    history[key] = fn;
                    if (next) {
                        next();
                    }
                };
            }, null);
        };
        Router.prototype.unwrapHistory = function () { };
        Router.prototype.subscribe = function () {
            var self = this;
            var handleLocationChange = function (e) {
                var state = "state" in e ? e.state : e.detail;
                var loc = locationToString(window.location);
                if (self.loc !== loc) {
                    if (self.rOwner.onLocationChange) {
                        self.rOwner.onLocationChange(state);
                    }
                    else {
                        self.rOwner.Renderer.scheduleRender();
                    }
                    self.loc = loc;
                }
            };
            this.wrapHistory(["pushState", "replaceState"]);
            addEventListener("pushstate", handleLocationChange);
            addEventListener("popstate", handleLocationChange);
            this.stop = function () {
                removeEventListener("pushstate", handleLocationChange);
                removeEventListener("popstate", handleLocationChange);
                self.unwrapHistory();
            };
        };
        return Router;
    }());

    var origin = function (loc) {
        return loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");
    };
    var isExternal = function (el) { return el && origin(window.location) !== origin(el); };
    /** `Link` component that provides application navigation */
    var Link = function (a, children) {
        return jsxFactory("a", __assign$1({}, a, { href: locString(a.to)[0], onclick: function (e) {
                var loc = window.location;
                if (a.onclick) {
                    a.onclick(e);
                }
                if (e.defaultPrevented || e.button !== 0 ||
                    e.altKey || e.metaKey || e.ctrlKey || e.shiftKey ||
                    isExternal(e.currentTarget)) {
                    return;
                }
                if (a.to) {
                    e.preventDefault();
                    var _a = locString(a.to), to = _a[0], state = _a[1];
                    if (to !== null && to !== locationToString(window.location)) {
                        history.pushState(state, "", to);
                    }
                }
            }, to: undefined }), children);
    };

    var makeAPIReferenceFileName = function (moduleName) { return moduleName + "_ref.json"; };
    var tutorialAddr = "#tutorial";
    var donateAddr = "#donate";
    var makeAPIReferenceHash = function (modName) { return "#apiref-" + modName; };
    var makeAPIReferenceItemHash = function (modName, name) {
        return makeAPIReferenceHash(modName) + "-" + name;
    };

    var TopLevelSectionsOrder = [
        "Classes", "Functions", "Constants", "Variables", "Types", "Interfaces"
    ];
    function getAPIReference(name) {
        return __awaiter(this, void 0, void 0, function () {
            var fileName;
            return __generator(this, function (_a) {
                fileName = makeAPIReferenceFileName(name);
                return [2 /*return*/, new Promise(function (resolve) {
                        return fetch("built/data/" + fileName).then(function (resp) { return resolve(resp.json()); });
                    })];
            });
        });
    }
    function getTOC(tree) {
        if (!tree.children) {
            return null;
        }
        var result = {
            Classes: [],
            Constants: [],
            Functions: [],
            Interfaces: [],
            Types: [],
            Variables: [],
        };
        for (var _i = 0, _a = tree.children; _i < _a.length; _i++) {
            var ch = _a[_i];
            switch (ch.kind) {
                case "VariableStatement":
                    if (ch.keyword && ch.keyword === "const") {
                        result.Constants.push(ch.name);
                    }
                    else {
                        result.Variables.push(ch.name);
                    }
                    break;
                case "InterfaceDeclaration":
                    result.Interfaces.push(ch.name);
                    break;
                case "TypeAliasDeclaration":
                    result.Types.push(ch.name);
                    break;
                case "ClassDeclaration":
                    result.Classes.push(ch.name);
                    break;
                case "FunctionDeclaration":
                    result.Functions.push(ch.name);
                    break;
                default:
                    throw new Error("Mom, what is it " + ch.kind + "?");
            }
        }
        for (var name_1 in result) {
            result[name_1] = result[name_1].sort();
        }
        var tab = {};
        var i = 1;
        for (var _b = 0, TopLevelSectionsOrder_1 = TopLevelSectionsOrder; _b < TopLevelSectionsOrder_1.length; _b++) {
            var name_2 = TopLevelSectionsOrder_1[_b];
            for (var _c = 0, _d = result[name_2]; _c < _d.length; _c++) {
                var ident = _d[_c];
                tab[ident] = i;
                i++;
            }
        }
        return [result, tab];
    }

    var APIRefController = /** @class */ (function () {
        function APIRefController(mainCtrl) {
            var _this = this;
            this.mainCtrl = mainCtrl;
            this.ready = {};
            this.fresh = true;
            this.Router = new Router(this, h);
            this.TreeCtrl = new APIRefContentController();
            this.TOCCtrl = new APIRefTOCController(function () { return _this.TreeCtrl.Renderer.scheduleRender(); });
        }
        Object.defineProperty(APIRefController.prototype, "Fresh", {
            get: function () { return this.fresh; },
            enumerable: true,
            configurable: true
        });
        APIRefController.prototype.onLocationChange = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var loc, hashRe, m, modname, tree, _a, toc, tab;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.fresh = false;
                            loc = window.location;
                            hashRe = /\#apiref\-([a-zA-Z_][a-zA-Z0-9_]*)(\-.*)?/;
                            m = loc.hash.match(hashRe);
                            if (!m) {
                                return [2 /*return*/];
                            }
                            modname = m[1];
                            if (modname in this.ready) {
                                this.setModule(modname);
                                return [2 /*return*/];
                            }
                            tree = null;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, , 3, 4]);
                            this.mainCtrl.loading(true);
                            return [4 /*yield*/, getAPIReference(modname)];
                        case 2:
                            tree = _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            this.mainCtrl.loading(false);
                            return [7 /*endfinally*/];
                        case 4:
                            if (!tree) {
                                return [2 /*return*/];
                            }
                            _a = getTOC(tree), toc = _a[0], tab = _a[1];
                            this.ready[modname] = {
                                tab: tab,
                                toc: toc,
                                tree: tree,
                            };
                            this.setModule(modname);
                            return [2 /*return*/];
                    }
                });
            });
        };
        APIRefController.prototype.setModule = function (modname) {
            this.TOCCtrl.setTOC(modname, this.ready[modname].toc);
            this.TreeCtrl.setTree(modname, this.ready[modname].tree, this.ready[modname].tab);
        };
        return APIRefController;
    }());
    function getKind(ch) {
        switch (ch.kind) {
            case "VariableStatement":
                if (ch.keyword && ch.keyword === "const") {
                    return "Constant";
                }
                else {
                    return "Variable";
                }
            case "InterfaceDeclaration":
                return "Interface";
            case "TypeAliasDeclaration":
                return "Type";
            case "ClassDeclaration":
                return "Class";
            case "Constructor":
                return "Constructor";
            case "FunctionDeclaration":
                return "Function";
            case "MethodSignature":
            case "MethodDeclaration":
                return "Method";
            case "PropertySignature":
            case "PropertyDeclaration":
                return "Property";
            default:
                throw new Error("Mom, what is it " + ch.kind + "?");
        }
    }
    function makeAPIRefContentSections(tree, modname, links, s, prefix) {
        if (s === void 0) { s = []; }
        if (prefix === void 0) { prefix = null; }
        for (var _i = 0, _a = tree.children; _i < _a.length; _i++) {
            var ch = _a[_i];
            var kind = getKind(ch);
            var name_1 = kind === "Constructor" ? "" : ch.name;
            if (prefix && kind !== "Constructor") {
                name_1 = prefix + "." + name_1;
            }
            var sInfo = {
                comment: ch.commentText,
                decl: ch.decl,
                hash: prefix ? undefined : "#apiref-" + modname + "-" + name_1,
                kind: kind,
                links: links,
                name: name_1,
            };
            if (ch.children && ch.children.length) {
                sInfo.subSections = [];
                makeAPIRefContentSections(ch, modname, links, sInfo.subSections, name_1);
            }
            s.push(sInfo);
        }
        return s;
    }
    var APIRefContentController = /** @class */ (function (_super) {
        __extends(APIRefContentController, _super);
        function APIRefContentController(links) {
            if (links === void 0) { links = {}; }
            var _this = _super.call(this, {
                modName: "",
                sections: [],
                tree: {},
            }) || this;
            _this.links = links;
            return _this;
        }
        APIRefContentController.prototype.setTree = function (modname, tree, tab) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    tree.children = tree.children.sort(function (a, b) { return tab[a.name] - tab[b.name]; });
                    this.set({
                        modName: modname,
                        sections: makeAPIRefContentSections(tree, modname, this.links),
                        tree: tree,
                    });
                    return [2 /*return*/];
                });
            });
        };
        return APIRefContentController;
    }(Actions));
    function makeSidebarSections(modName, toc, refreshContent) {
        var result = [];
        for (var _i = 0, TopLevelSectionsOrder_1 = TopLevelSectionsOrder; _i < TopLevelSectionsOrder_1.length; _i++) {
            var sectName = TopLevelSectionsOrder_1[_i];
            var tocItems = toc[sectName];
            if (tocItems.length < 1) {
                continue;
            }
            var info = {
                items: tocItems.map(function (name) {
                    return ({
                        active: false,
                        hash: makeAPIReferenceItemHash(modName, name),
                        refreshContent: refreshContent,
                        title: name,
                    });
                }),
                section: { title: sectName },
            };
            result.push(info);
        }
        return result;
    }
    var APIRefTOCController = /** @class */ (function (_super) {
        __extends(APIRefTOCController, _super);
        function APIRefTOCController(refreshContent) {
            var _this = _super.call(this, {
                sections: [],
                toc: {},
            }) || this;
            _this.refreshContent = refreshContent;
            return _this;
        }
        APIRefTOCController.prototype.setTOC = function (modName, toc) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.set({ toc: toc, sections: makeSidebarSections(modName, toc, this.refreshContent) });
                    return [2 /*return*/];
                });
            });
        };
        return APIRefTOCController;
    }(Actions));

    var MainController = /** @class */ (function (_super) {
        __extends(MainController, _super);
        function MainController() {
            return _super.call(this, { loading: 0 }) || this;
        }
        MainController.prototype.loading = function (on) {
            this.State.loading += on ? 1 : -1;
        };
        return MainController;
    }(Actions));

    function makeNavbarReferenceArgs(apiModNames) {
        var result = [];
        for (var _i = 0, apiModNames_1 = apiModNames; _i < apiModNames_1.length; _i++) {
            var modName = apiModNames_1[_i];
            result.push({ title: modName, hash: makeAPIReferenceHash(modName) });
        }
        return result;
    }
    var NavbarController = /** @class */ (function (_super) {
        __extends(NavbarController, _super);
        function NavbarController(apiModNames) {
            var _this = _super.call(this, {
                apiModNames: apiModNames,
                apirefData: makeNavbarReferenceArgs(apiModNames),
            }) || this;
            _this.Router = new Router(_this, h);
            return _this;
        }
        return NavbarController;
    }(Actions));

    var decodeParam = function (val) {
        try {
            return decodeURIComponent(val);
        }
        catch (_a) {
            return val;
        }
    };
    function parseHRoute(hashPattern, hashMatch, exact) {
        if (hashPattern === hashMatch || !hashPattern) {
            return { isExact: hashPattern === hashMatch, hashPattern: hashPattern, hashMatch: hashMatch };
        }
        var parts = hashPattern.slice(1).split("-");
        var mparts = hashMatch.slice(1).split("-");
        if (exact && parts.length !== mparts.length) {
            return null;
        }
        var result = {
            hashMatch: "#",
            hashPattern: hashPattern,
            isExact: false,
            params: {},
        };
        var plen = parts.length;
        var mlen = mparts.length;
        for (var i = 0; i < plen && i < mlen; i++) {
            var _a = [parts[i], mparts[i]], p = _a[0], u = _a[1];
            if (":" === p[0]) {
                p = p.slice(1);
                result.params[p] = u = decodeParam(u);
            }
            else if (p !== u) {
                return null;
            }
            result.hashMatch += u + "-";
        }
        result.hashMatch = result.hashMatch.slice(0, -1);
        return result;
    }
    var HRoute = function (a) { return function () {
        var loc = window.location;
        var match = parseHRoute(a.hash, loc.hash, a.exact);
        if (!match) {
            return null;
        }
        var c = a.component({ match: match }, []);
        if (typeof c === "function") {
            var x = c();
            return c();
        }
        return c;
    }; };

    var COMPLETE = 'complete',
        CANCELED = 'canceled';

    function raf(task){
        if('requestAnimationFrame' in window){
            return window.requestAnimationFrame(task);
        }

        setTimeout(task, 16);
    }

    function setElementScroll(element, x, y){
        if(element.self === element){
            element.scrollTo(x, y);
        }else{
            element.scrollLeft = x;
            element.scrollTop = y;
        }
    }

    function getTargetScrollLocation(target, parent, align){
        var targetPosition = target.getBoundingClientRect(),
            parentPosition,
            x,
            y,
            differenceX,
            differenceY,
            targetWidth,
            targetHeight,
            leftAlign = align && align.left != null ? align.left : 0.5,
            topAlign = align && align.top != null ? align.top : 0.5,
            leftOffset = align && align.leftOffset != null ? align.leftOffset : 0,
            topOffset = align && align.topOffset != null ? align.topOffset : 0,
            leftScalar = leftAlign,
            topScalar = topAlign;

        if(parent.self === parent){
            targetWidth = Math.min(targetPosition.width, parent.innerWidth);
            targetHeight = Math.min(targetPosition.height, parent.innerHeight);
            x = targetPosition.left + parent.pageXOffset - parent.innerWidth * leftScalar + targetWidth * leftScalar;
            y = targetPosition.top + parent.pageYOffset - parent.innerHeight * topScalar + targetHeight * topScalar;
            x -= leftOffset;
            y -= topOffset;
            differenceX = x - parent.pageXOffset;
            differenceY = y - parent.pageYOffset;
        }else{
            targetWidth = targetPosition.width;
            targetHeight = targetPosition.height;
            parentPosition = parent.getBoundingClientRect();
            var offsetLeft = targetPosition.left - (parentPosition.left - parent.scrollLeft);
            var offsetTop = targetPosition.top - (parentPosition.top - parent.scrollTop);
            x = offsetLeft + (targetWidth * leftScalar) - parent.clientWidth * leftScalar;
            y = offsetTop + (targetHeight * topScalar) - parent.clientHeight * topScalar;
            x = Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
            y = Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
            x -= leftOffset;
            y -= topOffset;
            differenceX = x - parent.scrollLeft;
            differenceY = y - parent.scrollTop;
        }

        return {
            x: x,
            y: y,
            differenceX: differenceX,
            differenceY: differenceY
        };
    }

    function animate(parent){
        var scrollSettings = parent._scrollSettings;
        if(!scrollSettings){
            return;
        }

        var location = getTargetScrollLocation(scrollSettings.target, parent, scrollSettings.align),
            time = Date.now() - scrollSettings.startTime,
            timeValue = Math.min(1 / scrollSettings.time * time, 1);

        if(
            time > scrollSettings.time &&
            scrollSettings.endIterations > 3
        ){
            setElementScroll(parent, location.x, location.y);
            parent._scrollSettings = null;
            return scrollSettings.end(COMPLETE);
        }

        scrollSettings.endIterations++;

        var easeValue = 1 - scrollSettings.ease(timeValue);

        setElementScroll(parent,
            location.x - location.differenceX * easeValue,
            location.y - location.differenceY * easeValue
        );

        // At the end of animation, loop synchronously
        // to try and hit the taget location.
        if(time >= scrollSettings.time){
            return animate(parent);
        }

        raf(animate.bind(null, parent));
    }
    function transitionScrollTo(target, parent, settings, callback){
        var idle = !parent._scrollSettings,
            lastSettings = parent._scrollSettings,
            now = Date.now(),
            endHandler;

        if(lastSettings){
            lastSettings.end(CANCELED);
        }

        function end(endType){
            parent._scrollSettings = null;
            if(parent.parentElement && parent.parentElement._scrollSettings){
                parent.parentElement._scrollSettings.end(endType);
            }
            callback(endType);
            parent.removeEventListener('touchstart', endHandler, { passive: true });
            parent.removeEventListener('wheel', endHandler, { passive: true });
        }

        parent._scrollSettings = {
            startTime: lastSettings ? lastSettings.startTime : Date.now(),
            endIterations: 0,
            target: target,
            time: settings.time + (lastSettings ? now - lastSettings.startTime : 0),
            ease: settings.ease,
            align: settings.align,
            end: end
        };

        endHandler = end.bind(null, CANCELED);
        parent.addEventListener('touchstart', endHandler, { passive: true });
        parent.addEventListener('wheel', endHandler, { passive: true });

        if(idle){
            animate(parent);
        }
    }

    function defaultIsScrollable(element){
        return (
            'pageXOffset' in element ||
            (
                element.scrollHeight !== element.clientHeight ||
                element.scrollWidth !== element.clientWidth
            ) &&
            getComputedStyle(element).overflow !== 'hidden'
        );
    }

    function defaultValidTarget(){
        return true;
    }

    var scrollIntoView = function(target, settings, callback){
        if(!target){
            return;
        }

        if(typeof settings === 'function'){
            callback = settings;
            settings = null;
        }

        if(!settings){
            settings = {};
        }

        settings.time = isNaN(settings.time) ? 1000 : settings.time;
        settings.ease = settings.ease || function(v){return 1 - Math.pow(1 - v, v / 2);};

        var parent = target.parentElement,
            parents = 0;

        function done(endType){
            parents--;
            if(!parents){
                callback && callback(endType);
            }
        }

        var validTarget = settings.validTarget || defaultValidTarget;
        var isScrollable = settings.isScrollable;

        while(parent){
            if(validTarget(parent, parents) && (isScrollable ? isScrollable(parent, defaultIsScrollable) : defaultIsScrollable(parent))){
                parents++;
                transitionScrollTo(target, parent, settings, done);
            }

            parent = parent.parentElement;

            if(!parent){
                if(!parents){
                    callback && callback(COMPLETE);
                }
                break;
            }

            if(parent.tagName === 'BODY'){
                parent = parent.ownerDocument;
                parent = parent.defaultView || parent.ownerWindow;
            }
        }
    };

    var SidebarSectionLi = function (a) { return (h("li", { class: "uk-nav-header" }, a.title)); };
    var SidebarLi = function (a) {
        return a.active ?
            h("li", { class: "uk-active" },
                h(Link, { to: "./" + a.hash, onclick: a.refreshContent }, a.title))
            :
                h("li", null,
                    h(Link, { to: "./" + a.hash }, a.title));
    };
    var makeSection = function (info, activeHash) {
        var result = [SidebarSectionLi(info.section)];
        return result.concat(info.items.map(function (item) { return (h(SidebarLi, __assign({}, __assign({}, item, { active: item.hash === activeHash })))); }));
    };
    var SideBar = function (a) { return (h("div", { key: "Sidebar", class: "ho-sidebar-left uk-visible@m" },
        h("h4", { class: "ho-h4", key: "SidebarTitle" }, a.title),
        h("ul", { class: "uk-nav uk-nav-default", key: "SidebarUl" }, a.sections.map(function (info) { return makeSection(info, a.activeHash); })))); };

    var APIRefSidebar = function (info) { return function (a) { return (h(SideBar, { title: "module" in a.match.params ? a.match.params.module + " API" : null, sections: "module" in a.match.params ? info : null, activeHash: a.match.hashMatch })); }; };
    var onCreateContentSection = function (a) { return function (el) {
        if (a.hash === window.location.hash) {
            scrollIntoView(el, { align: { top: 0, topOffset: 90 } });
        }
    }; };
    var onCreateMarkdownSection = function (a) { return function (el) {
        el.innerHTML = marked(a.comment, { sanitize: true });
    }; };
    var highlightCode = function (text) { return function (el) {
        var lang = "tsx";
        el.innerHTML = Prism.highlight(text, Prism.languages[lang], lang);
    }; };
    var Code = function (a) { return (h("pre", { style: "margin-left: 20px" },
        h("code", { oncreate: highlightCode(a.decl), onupdate: highlightCode(a.decl) }))); };
    var Comment = function (a) { return (h("p", { oncreate: onCreateMarkdownSection(a), onupdate: onCreateMarkdownSection(a), style: "margin-left: 20px" })); };
    var APIRefContentMajorSection = function (a) { return (h("div", { onupdate: onCreateContentSection(a), class: "ho-content-section" },
        h("h4", { class: a.hash === window.location.hash ?
                "ho-major-content-active-header" : "ho-major-content-header" },
            a.kind + " ",
            h("a", { href: a.hash },
                h("span", { class: "ho-header-identifier" }, a.name))),
        h(Code, { decl: a.decl }),
        h(Comment, { comment: a.comment }),
        a.subSections && a.subSections.length ? [
            h("h5", { class: "ho-minor-content-header" }, a.kind === "Class" ? "Members" :
                a.kind === "Interface" ? "Properties" : "")
        ].concat(a.subSections.map(function (x) { return h(APIRefContentSection, __assign({}, x)); })) :
            "")); };
    var APIRefContentSection = function (a) { return (h("div", { class: "ho-content-section" },
        h(Code, { decl: a.decl }),
        h(Comment, { comment: a.comment }))); };
    var APIRefContent = function (a) { return (h("div", { onupdate: function (el) {
            if (window.location.hash.split("-").length < 3) {
                scrollIntoView(el, { align: { topOffset: 200 } });
            }
        } },
        h("h3", { class: "ho-h4", style: "margin-bottom: 60px" },
            a.module,
            " API ",
            a.version ?
                h("span", { class: "uk-text-small", style: "position: relative; top: 5px; color: #999" }, "version " + a.version,
                    ", ",
                    h("a", { href: "https://www.typescriptlang.org/" }, "TypeScript"))
                :
                    ""),
        a.sections.map(function (x) { return h(APIRefContentMajorSection, __assign({}, x)); }))); };

    var NavbarDropdownLi = function (a, children) { return (h("li", { class: a.visible ? "uk-visible@" + a.visible : "" },
        h("a", { href: "#" }, a.title),
        h("div", { class: "uk-navbar-dropdown" },
            h("ul", { class: "uk-nav uk-navbar-dropdown-nav" }, children)))); };
    var NavbarDropdownIconLi = function (a, children) { return (h("li", { class: a.visible ? "uk-visible@" + a.visible + " " : "" +
            a.hidden ? "uk-hidden@" + a.hidden : "" },
        h("a", { href: "#", class: "uk-icon-link", "uk-icon": a.title }),
        h("div", { class: "uk-navbar-dropdown" },
            h("ul", { class: "uk-nav uk-navbar-dropdown-nav" }, children)))); };
    var NavbarLi = function (a) { return (h("li", { class: a.visible ? "uk-visible@" + a.visible : "" },
        h(Link, { to: a.hash }, a.title))); };
    var NavbarSearchLi = function (a) { return (h("li", { class: a.visible ? "uk-visible@" + a.visible : "" },
        h("div", { class: "uk-navbar-item" },
            h("form", { class: "uk-search uk-search-navbar" },
                h("span", { "uk-search-icon": true, class: "ho-scaled-search-icon" }),
                h("input", { class: "uk-search-input", type: "search", onkeyup: function (e) { return (e.keyCode === 13 ? a.onSearch() : ""); }, oninput: function (e) { return a.onSearchInput(e.target.value); }, value: a.searchValue }))))); };
    var hyperoopGithub = "https://github.com/hyperoop/hyperoop";
    var NavbarMenuUl = function (a) { return (h("ul", { class: "uk-navbar-nav" },
        a.searchArgs ?
            h(NavbarSearchLi, { onSearchInput: a.searchArgs.onSearchInput, onSearch: a.searchArgs.onSearch, searchValue: a.searchArgs.searchValue, visible: "m" }) : "",
        a.hasTutorial ? h(NavbarLi, { title: "Tutorial", hash: tutorialAddr, visible: "m" }) : "",
        a.reference.length ?
            h(NavbarDropdownLi, { title: "API Reference", visible: "m" }, a.reference.map(function (_a) {
                var title = _a.title, hash = _a.hash;
                return h(NavbarLi, { title: title, hash: hash });
            })) :
            "",
        a.examples.length ?
            h(NavbarDropdownLi, { title: "Examples", visible: "m" }, a.examples.map(function (_a) {
                var title = _a.title, hash = _a.hash;
                return h(NavbarLi, { title: title, hash: hash });
            })) :
            "",
        a.hasDonationsPage ? h(NavbarLi, { title: "Donate", hash: donateAddr, visible: "m" }) : "",
        h("li", { class: "uk-visible@m" },
            h("a", { href: hyperoopGithub, target: "_blank", rel: "noopener noreferrer", class: "uk-icon-link", "uk-icon": "github" })),
        h("li", { class: "uk-visible@m" },
            h("a", { href: "https://gitter.im/hyper-oop", target: "_blank", rel: "noopener noreferrer", class: "uk-icon-link", "uk-icon": "gitter" })),
        h(NavbarDropdownIconLi, { title: "table", hidden: "m" },
            h("li", { class: "uk-nav-header" }, "API"),
            a.reference.map(function (_a) {
                var title = _a.title, hash = _a.hash;
                return h(NavbarLi, { title: title, hash: hash });
            }),
            h("li", { class: "uk-nav-header" }, "Community"),
            h("li", null,
                h("a", { href: hyperoopGithub, target: "_blank", rel: "noopener noreferrer" },
                    h("span", { "uk-icon": "icon: github; ratio: 0.8" }, " "),
                    " GitHub")),
            h("li", null,
                h("a", { href: "https://gitter.im/hyper-oop", target: "_blank", rel: "noopener noreferrer" },
                    h("span", { "uk-icon": "icon: gitter; ratio: 0.8" }, " "),
                    " Gitter"))))); };

    function main() {
        return __awaiter(this, void 0, void 0, function () {
            var mainController, apirefController, navbarController, navbarView, apiSidebarView, apiRefContentView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mainController = new MainController();
                        apirefController = new APIRefController(mainController);
                        navbarController = new NavbarController(["HyperOOP", "Router", "RedoUndo"]);
                        apirefController.Router.go("./#apiref-HyperOOP");
                        if (!apirefController.Fresh) return [3 /*break*/, 2];
                        return [4 /*yield*/, apirefController.onLocationChange(null)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        navbarView = function () { return (h(NavbarMenuUl, { hasTutorial: false, hasDonationsPage: false, examples: [], reference: navbarController.State.apirefData, searchArgs: null })); };
                        apiSidebarView = function () { return (h(HRoute, { exact: false, hash: "#apiref-:module-:identifier", component: APIRefSidebar(apirefController.TOCCtrl.State.sections) })); };
                        apiRefContentView = function () { return (h(APIRefContent, { version: apirefController.TreeCtrl.State.tree.version, module: apirefController.TreeCtrl.State.modName, sections: apirefController.TreeCtrl.State.sections })); };
                        init(document.getElementById("navbarPlace"), navbarView, navbarController);
                        init(document.getElementById("sidebarPlace"), apiSidebarView, apirefController.TOCCtrl);
                        init(document.getElementById("contentPlace"), apiRefContentView, apirefController.TreeCtrl);
                        return [2 /*return*/];
                }
            });
        });
    }
    main();

}));
//# sourceMappingURL=index.js.map
