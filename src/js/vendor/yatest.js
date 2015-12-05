/*
 * YATest..
 * Yet Another Test framework..
 *
 * I got fed up with NodeJS required everywhere..
 * There is world outside of NodeJS, and I want to live there.
 *
 * Licensed under WTFPL
 * http://www.wtfpl.net/
 *
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * Version 2, December 2004
 *
 * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 */
"use strict";
define(function(){
    class Assert {
        constructor() {
            this.reset();
        }

        reset() {
            this.passed = true;
            this.message = undefined;
            this.expectedException = null;
        }


        _fail(msg) {
            // Fail
            this.passed = false;
            this.message = msg;
        }

        // fail()
        // fail(String message)
        fail(msg) {
            // Fail
            this._fail(msg);
            throw this;
        }

        getPass() {
            return this.passed;
        }

        getMessage() {
            if( this.message === undefined ) {
                return "";
            }
            return this.message;
        }

        handleException(exception) {
            if(exception === this) {
                return;
            }

            if(this.expectedException !== null) {
                if(this.expectedException === exception) {
                    // Pass
                    return;
                }
            }
            this._fail("Unexpected Exception: " + exception);
        }

        expectException(exception) {
            this.expectedException = exception;
        }

        isTrue(val, msg) {
            if(val === true) {
                // Success!
                return;
            }
            this.fail(msg);
        }

        isFalse(val, msg) {
            if(val === false) {
                // Success!
                return;
            }
            this.fail(msg);
        }

        isNull(val, msg) {
            if(val === null) {
                // Success!
                return;
            }
            this.fail(msg);
        }

        isNotNull(val, msg) {
            if(val !== null) {
                // Success!
                return;
            }
            this.fail(msg);
        }

        isUndefined(val, msg) {
            if(val === undefined) {
                // Success!
                return;
            }
            this.fail(msg);
        }

        isNotUndefined(val, msg) {
            if(val !== undefined) {
                // Success!
                return;
            }
            this.fail(msg);
        }

        isNumber(val, msg) {
            if(!isNaN(val)) {
                // Success!
                return;
            }
            this.fail(msg);
        }

        isEqual(val, expected, msg) {
            if(val === expected) {
                // Success!
                return;
            }
            this.fail(msg);
        }

        isNotEqual(val, expected, msg) {
            if(val !== expected) {
                // Success!
                return;
            }
            this.fail(msg);
        }
    }

    class Test {
        constructor() {
            this.assert = new Assert();
        }
    }

    class Runner {
        constructor() {
            this.results = null;
        }

        run(test) {
            var results = [];
            if( test instanceof Array ) {
                for( var i = 0 ; i < test.length ; ++i ) {
                    results.push(this.run({
                        test: test[i]
                    }));
                }
                this.results = results;
                return results;
            }

            if( !(test instanceof Test) ) {
                return {
                    name: test.constructor.name,
                    pass: false,
                    message: "The test does not inherit from Test class."
                };
            }

            // Single case test.
            var prototypeMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(test));
            for (var i = 0 ; i < prototypeMethods.length ; ++i) {
                var propertyName = prototypeMethods[i];
                if( (typeof test[propertyName] !== "function") ) {
                    continue;
                }

                // Unfortunately no annotations, so we use the 'test' prefix.
                if( !/^test/.test(propertyName) ) {
                    continue;
                }

                test.assert.reset();
                try {
                    test[propertyName]();
                }
                catch(Exception) {
                    test.assert.handleException(Exception);
                }

                results.push({
                    name: propertyName,
                    result: test.assert.getPass(),
                    message: test.assert.getMessage()
                });
            }

            var result = {
                name: test.constructor.name,
                result: results
            };
            this.results = result;
            return result;
        }

        print(printFunction) {
            var result = this.results;

            var formatter = function(item) {
                var str = '\n' + item.name + ':';
                for( var i = 0 ; i < item.result.length ; ++i ) {
                    var res = item.result[i];
                    str += '\n - ' + res.name + ': ' + (res.result ? 'passed' : 'failed : ' + res.message);
                }
                str += '\n';
                return str;
            };

            if( result instanceof Array ) {
                for(var i = 0 ; i < result.length ; ++i ) {
                    printFunction(formatter(result[i]));
                }
                return;
            }
            printFunction(formatter(result));
        }
    }

    return {
        Test: Test,
        Runner: Runner
    }
});
