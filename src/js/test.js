
require([
    "qunit",
    "system/array2d.test"],
    function(
        QUnit ,
        Array2D) {

        var tests = [];

        tests.push(Array2D);

        for (var ti = 0; ti < tests.length; ++ti) {
            var iter = tests[ti];
            QUnit.module(iter.name , function() {
                var test = iter;
                for (var member in test) {
                    if ((typeof test[member] !== "function")) {
                        continue;
                    }

                    // Unfortunately no annotations, so we use the 'test' prefix.
                    if (!/^test/.test(member)) {
                        continue;
                    }
                    QUnit.test(member, test[member]);
                }
            });
        }
        // start QUnit.
        QUnit.load();
        QUnit.start();
    });

