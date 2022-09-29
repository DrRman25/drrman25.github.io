'use strict';

var outChannel = null;

addEventListener("message", function(e) {
    if (e.origin != document.location.origin) {
        return;
    }
    if (e.data.type == "load") {
        outChannel = e.ports[0];
        var scriptTag = document.createElement("script");
        scriptTag.type = "module";
        scriptTag.textContent = e.data.code;
        document.body.appendChild(scriptTag);
    }
});

function ctorName(obj) {
    var ctor = obj.constructor?.name;
    if (ctor) {
        return ctor;
    }
    var m = /\[object (\w+)\]/.exec(obj + "");
    return m ? m[1] : null;
}

function serialize(val) {
    var seen = new Set();
    function inner(val) {
        if (val instanceof Error) {
            return {
                error: val.toString(),
                stack: val.stack
            };
        }
        if (typeof val == "function") {
            return {
                function: val.name || "?"
            };
        }
        if (val == null || typeof val != "object") {
            return val;
        }
        if (seen.has(val)) {
            return {
                cycle: true
            };
        }
        seen.add(val);
        if (Array.isArray(val)) {
            return {
                array: val.map(inner)
            };
        }
        var result = {
            object: Object.create(null),
            ctor: ctorName(val)
        };
        for (var prop of Object.keys(val)) {
            try {
                result.object[prop] = inner(val[prop]);
            } catch(err) {
                // nothing here lol
            }
        }
        return result;
    }
    return inner(val);
}

function wrapConsole(level) {
    var old = console[level];
    console[level] = function(...args) {
        old.apply(console, args);
        if (outChannel) {
            outChannel.postMessage({log: level, elements: args.map(serialize)});
        }
    };
}

wrapConsole("log");
wrapConsole("info");
wrapConsole("warn");
wrapConsole("error");

window.addEventListener("error", function(e) {
    console.error(e.error);
});
