document.getElementById("es1-check-container").style.display = "none";
document.getElementById("es5-check-container").style.display = "none";
document.getElementById("es6-check-container").style.display = "none";
document.getElementById("es2016-check-container").style.display = "none";
document.getElementById("es2017-check-container").style.display = "none";
document.getElementById("es2018-check-container").style.display = "none";

function startChecks() {
    document.getElementById("check-btn").innerHTML = ". . .";
    document.getElementById("es1-check-container").style.display = "none";
    document.getElementById("es5-check-container").style.display = "none";
    document.getElementById("es6-check-container").style.display = "none";
    document.getElementById("es2016-check-container").style.display = "none";
    document.getElementById("es2017-check-container").style.display = "none";
    document.getElementById("es2018-check-container").style.display = "none";
    setTimeout(function() {
        document.getElementById("es1-check-container").style.display = "";
        if (true) {
            document.getElementById("es1-check").innerHTML = "Yes";
            document.getElementById("es1-check").style.color = "green";
            setTimeout(function() {
                document.getElementById("es5-check-container").style.display = "";
                try {
                    "mystring".trim();
                    document.getElementById("es5-check").innerHTML = "Yes";
                    document.getElementById("es5-check").style.color = "green";
                    setTimeout(function() {
                        document.getElementById("es6-check-container").style.display = "";
                        try {
                            "mystring".includes("str");
                            document.getElementById("es6-check").innerHTML = "Yes";
                            document.getElementById("es6-check").style.color = "green";
                            setTimeout(function() {
                                document.getElementById("es2016-check-container").style.display = "";
                                try {
                                    ["a", "b", "c", "d"].includes("d");
                                    document.getElementById("es2016-check").innerHTML = "Yes";
                                    document.getElementById("es2016-check").style.color = "green";
                                    setTimeout(function() {
                                        document.getElementById("es2017-check-container").style.display = "";
                                        try {
                                            "d".padStart(4, 0);
                                            document.getElementById("es2017-check").innerHTML = "Yes";
                                            document.getElementById("es2017-check").style.color = "green";
                                            setTimeout(function() {
                                                document.getElementById("es2018-check-container").style.display = "";
                                                try {
                                                    /d/s.dotAll;
                                                    document.getElementById("es2018-check").innerHTML = "Yes";
                                                    document.getElementById("es2018-check").style.color = "green";
                                                } catch(err) {
                                                    document.getElementById("es2018-check").innerHTML = "No";
                                                    document.getElementById("es2018-check").style.color = "red";
                                                }
                                                document.getElementById("check-btn").innerHTML = "Perform the Checks Again";
                                            }, 1500);
                                        } catch(err) {
                                            document.getElementById("es2017-check").innerHTML = "No";
                                            document.getElementById("es2017-check").style.color = "red";
                                            document.getElementById("es2018-check").innerHTML = "No";
                                            document.getElementById("es2018-check").style.color = "red";
                                        }
                                    }, 1500);
                                } catch(err) {
                                    document.getElementById("es2017-check-container").style.display = "";
                                    document.getElementById("es2018-check-container").style.display = "";
                                    document.getElementById("es2016-check").innerHTML = "No";
                                    document.getElementById("es2016-check").style.color = "red";
                                    document.getElementById("es2017-check").innerHTML = "No";
                                    document.getElementById("es2017-check").style.color = "red";
                                    document.getElementById("es2018-check").innerHTML = "No";
                                    document.getElementById("es2018-check").style.color = "red";
                                    document.getElementById("check-btn").innerHTML = "Perform the Checks Again";
                                }
                            }, 1500);
                        } catch(err) {
                            document.getElementById("es2016-check-container").style.display = "";
                            document.getElementById("es2017-check-container").style.display = "";
                            document.getElementById("es2018-check-container").style.display = "";
                            document.getElementById("es6-check").innerHTML = "No";
                            document.getElementById("es6-check").style.color = "red";
                            document.getElementById("es2016-check").innerHTML = "No";
                            document.getElementById("es2016-check").style.color = "red";
                            document.getElementById("es2017-check").innerHTML = "No";
                            document.getElementById("es2017-check").style.color = "red";
                            document.getElementById("es2018-check").innerHTML = "No";
                            document.getElementById("es2018-check").style.color = "red";
                            document.getElementById("check-btn").innerHTML = "Perform the Checks Again";
                        }
                    }, 1500);
                } catch(err) {
                    document.getElementById("es6-check-container").style.display = "";
                    document.getElementById("es2016-check-container").style.display = "";
                    document.getElementById("es2017-check-container").style.display = "";
                    document.getElementById("es2018-check-container").style.display = "";
                    document.getElementById("es5-check").innerHTML = "No";
                    document.getElementById("es5-check").style.color = "red";
                    document.getElementById("es6-check").innerHTML = "No";
                    document.getElementById("es6-check").style.color = "red";
                    document.getElementById("es2016-check").innerHTML = "No";
                    document.getElementById("es2016-check").style.color = "red";
                    document.getElementById("es2017-check").innerHTML = "No";
                    document.getElementById("es2017-check").style.color = "red";
                    document.getElementById("es2018-check").innerHTML = "No";
                    document.getElementById("es2018-check").style.color = "red";
                    document.getElementById("check-btn").innerHTML = "Perform the Checks Again";
                }
            }, 1500);
        }
    }, 1000);
}