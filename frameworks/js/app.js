/*jslint white:true*/
/*jslint plusplus: true */
/*global angular, alert, confirm, console, document, Chart, Set, $, jsPDF*/
/*eslint-disable no-console*/

'use strict';
var app = angular.module("myApp", ["ngRoute", "ui.bootstrap"]);

// Pagination with Client-Side Data
app.filter("offset", function () {
    return function (input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});

//custom table directive
app.directive('myTable', function () {
    return {
        restrict: 'EA',
        templateUrl: 'template/table-template.html',
        scope: {
            items: '='
        }
    };
});

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.
    when("/home", {
        templateUrl: "template/home.html"
    }).
    when("/dashboard", {
        templateUrl: "template/dashboard.html"
    }).
    when("/all-expenses", {
        templateUrl: "template/allExpenses.html"
    }).
    when("/all-income", {
        templateUrl: "template/allIncome.html"
    }).
    when("/settings", {
        templateUrl: "template/settings.html"
    }).
    otherwise({
        redirectTo: "/home"
    });
});

//Get user information from session.php
app.factory("User", function ($http) {
    return {
        users: function () {
            return $http.get("api/session.php").then(function (response) {
                return response.data[0];
            });
        }
    };
});

//login
app.run(function ($rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if ($rootScope.loggedInUser === null) {
            // no logged user, redirect to /login
            if (next.templateUrl === "template/home.html") {
                // if in log in page
            } else {
                $location.path("/home");
            }
        }
    });
});

//controller to close login and signup bootstrap modal, otherwise page will freeze when the view changes
app.controller("mainCtrl", function ($scope, $uibModal) {
    $scope.openLoginModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'loginModal',
            controller: 'loginCtrl'
        });
    };

    $scope.openSignUpModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'signupModal',
            controller: 'signupCtrl'
        });
    };
});

app.controller("loginCtrl", function ($scope, $http, $location, $uibModalInstance) {
    $scope.loginbtn = function () {
        var url = "api/login.php",
            data = $scope.login;
        
        $http.post(url, data).then(function (response) {
            if (response.data === "Login Successful") {
                console.log(response.data);
                $location.path("/dashboard");
                $uibModalInstance.close();
            } else {
                alert(response.data);
            }
        }, function (response) {
            console.log(response);
        });
    };

    $scope.closeModal = function () {
        $uibModalInstance.close();
    };
});

app.controller("signupCtrl", function ($scope, $http, $location, $uibModalInstance) {
    $scope.registerbtn = function () {
        var url = "api/register.php",
            data = $scope.signup,
            errorMsg = document.getElementById("errorMsg");

        $http.post(url, data).then(function (response) {
            if (response.data) {
                if (response.data === "Register Successful!") {
                    alert(response.data);
                    $uibModalInstance.close();
                    $location.path("/home");
                } else {
                    errorMsg.innerHTML = response.data;
                }
                console.log(response.data);
            }
        }, function (response) {
            console.log(response);
        });
    };

    $scope.closeModal = function () {
        $uibModalInstance.close();
    };
});

app.controller("dashboardCtrl", function ($scope, $http, $location, $rootScope, User, $route, $timeout) {

    //toggle change password and cancel button
    $('#change-password-btn').click(function () {
        $('#change-password-btn').hide();
        $('#change-password').show();
        $('#cancel-change').show();
    });
    $('#cancel-change').click(function () {
        $('#cancel-change').hide();
        $('#change-password').hide();
        $('#change-password-btn').show();
    });

    $scope.logout = function () {
        $rootScope.loggedInUser = null;
        $location.path("/home");
    };

    //function to load user, expenses, income and category. this function is applied to all templates except home page through ngInit
    $scope.loadData = function () {
        User.users().then(function (response) {
            console.log(response);
            $scope.user = response;
            $rootScope.loggedInUser = $scope.user.name;

            $scope.updateAcc = {}; //information to be passed when user updates their account
            $scope.updateAcc.fullname = $scope.user.name;
            $scope.updateAcc.email = $scope.user.email;
            $scope.updateAcc.bankBal = parseFloat($scope.user.balance);
            $scope.updateAcc.accType = $scope.user.accType;
            $scope.updateAcc.password = $scope.user.password;

            $scope.getCookie();

        }, function (response) {
            console.log(response.data);
        });

        $scope.changeTextClass(); //this function changes the limit text colour when the limit is below 30%
        $scope.editLimit = function (value) {
            var url = "api/edit.php?type=limit";
            $http.put(url, value).then(function (response) {
                if (response.data) {
                    alert(response.data);
                    $('.modal').modal('hide');
                    $scope.loadData();
                }
            }, function (response) {
                console.log(response.data);
            });
        };

        $http.get("api/income.php").then(function (response) {
            console.log(response.data);
            $scope.userIncome = response.data;
            var i;
            $scope.incCatArray = [];

            for (i = 0; i < $scope.userIncome.length; i += 1) {
                $scope.incCatArray.push($scope.userIncome[i].category); //insert the categories used in income to array
                $scope.userIncome[i].date = new Date($scope.userIncome[i].date);
                $scope.userIncome[i].amount = parseFloat($scope.userIncome[i].amount);
            }

            $scope.incLabels = new Set($scope.incCatArray); //Filters duplicate categories in the incCatArray array
            $scope.incLabels = Array.from($scope.incLabels); //convert to array
            
        }, function (response) {
            console.log(response.data);
        });

        $http.get("api/expenses.php").then(function (response) {
            console.log(response.data);
            $scope.userExpenses = response.data;

            var i, count = {},
                values = [];
            $scope.expCatArray = [];
            for (i = 0; i < $scope.userExpenses.length; i += 1) {
                $scope.expCatArray.push($scope.userExpenses[i].category); //insert the categories used in expenses to array
                $scope.userExpenses[i].date = new Date($scope.userExpenses[i].date);
                $scope.userExpenses[i].amount = parseFloat($scope.userExpenses[i].amount);
            }

            $scope.labels = new Set($scope.expCatArray); //Filters duplicate categories in the expCatArray array
            $scope.labels = Array.from($scope.labels); //convert to array

            $scope.expCatArray.forEach(function (i) {
                count[i] = (count[i] || 0) + 1; //count the number of each category
            });
            for (i in count) {
                values.push(count[i]);
            }

            //highest expenses pie chart
            var ctx = document.getElementById('highestExpChart').getContext('2d'),
                highestExpChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: $scope.labels,
                        datasets: [{
                            label: 'Highest Expenses',
                            data: values,
                            backgroundColor: [
                        'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(124, 178, 200, 1)'
                        ]
                    }]
                    },
                    options: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltips: {
                            callbacks: {
                                //this section is to convert the tooltip to percentage instead of number
                                label: function (tooltipItem, data) {
                                    var dataset = data.datasets[tooltipItem.datasetIndex],
                                        meta = dataset._meta[Object.keys(dataset._meta)[0]],
                                        total = meta.total,
                                        currentValue = dataset.data[tooltipItem.index],
                                        percentage = parseFloat((currentValue / total * 100).toFixed(1));
                                    return percentage + '%';
                                },
                                title: function (tooltipItem, data) {
                                    return data.labels[tooltipItem[0].index];
                                }
                            }
                        }
                    }
                });

            //monthly expenses and income line chart
            $http.get("api/monthlyChart.php").then(function (response) {
                console.log(response.data[1].length);
                $scope.expMonth = [];
                $scope.incMonth = [];
                var x, i, z,
                    ctx2 = document.getElementById('monthlyExpAndInc').getContext('2d'),
                    current = new Date(),
                    currentYear = current.getFullYear();

                $scope.expMonthByCat = {};
                $scope.incMonthByCat = {};

                for (z = 0; z < $scope.labels.length; z++) {
                    $scope.expMonthByCat[$scope.labels[z]] = new Array(12);
                    for (x = 0; x < 12; x++) {
                        $scope.expMonthByCat[$scope.labels[z]][x] = 0; //create object with expenses category as key and populate it with 0
                    }
                }

                for (z = 0; z < $scope.incLabels.length; z++) {
                    $scope.incMonthByCat[$scope.incLabels[z]] = new Array(12);
                    for (x = 0; x < 12; x++) {
                        $scope.incMonthByCat[$scope.incLabels[z]][x] = 0; //create object with income category as key and populate it with 0 
                    }
                }

                for (x = 0; x < 12; x++) {
                    $scope.expMonth[x] = 0;
                    $scope.incMonth[x] = 0;

                    for (i = 0; i < response.data[0].length; i++) {
                        if (response.data[0][i].expMonth == x + 1 && response.data[0][i].expYear == currentYear) {
                            var expAmount = response.data[0][i].expAmount;
                            $scope.expMonth[x] = parseFloat(Number(expAmount).toFixed(2)); //total expenses by month
                        }
                    }

                    for (i = 0; i < response.data[1].length; i++) {
                        if (response.data[1][i].incMonth == x + 1 && response.data[1][i].incYear == currentYear) {
                            var incAmount = response.data[1][i].incAmount;
                            $scope.incMonth[x] = parseFloat(Number(incAmount).toFixed(2)); //total income by month
                        }
                    }

                    for (i = 0; i < response.data[2].length; i++) {
                        $scope.labels.forEach(function (k) {
                            if (response.data[2][i].category == k) {
                                if (response.data[2][i].expMonth == x + 1 && response.data[2][i].expYear == currentYear) {
                                    var expByCat = response.data[2][i].expAmount;
                                    $scope.expMonthByCat[k][x] = parseFloat(Number(expByCat).toFixed(2)); //total expense per category by month
                                }
                            }
                        });
                    }

                    for (i = 0; i < response.data[3].length; i++) {
                        $scope.incLabels.forEach(function (k) {
                            if (response.data[3][i].category == k) {
                                if (response.data[3][i].incMonth == x + 1 && response.data[3][i].incYear == currentYear) {
                                    var incByCat = response.data[3][i].incAmount;
                                    $scope.incMonthByCat[k][x] = parseFloat(Number(incByCat).toFixed(2)); //total income per category by month
                                }
                            }
                        });
                    }
                }

                $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                var monthlyChart = new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: $scope.months,
                        datasets: [{
                                label: 'Expenses (RM)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'transparent',
                                data: $scope.expMonth
                    },
                            {
                                label: 'Income (RM)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                backgroundColor: 'transparent',
                                data: $scope.incMonth
                    }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });

                $scope.downloadPDF = function () { //download pdf function
                    var chart = document.querySelector('#monthlyExpAndInc'),
                        chartImg = chart.toDataURL('image/png', 1.0),
                        doc = new jsPDF('landscape');

                    doc.setFontSize(30);
                    doc.text(15, 15, 'Monthly Expenses and Income ' + currentYear);
                    doc.addImage(chartImg, 'PNG', 10, 30, 280, 150);

                    doc.addPage();
                    doc.autoTable({
                        html: '#monthly-summary'
                    });

                    doc.save('monthly-chart.pdf');
                };

            }, function (response) {
                console.log(response.data);
            });

        }, function (response) {
            console.log(response.data);
        });

        $http.get("api/category.php").then(function (response) {
            console.log(response.data);
            $scope.categories = response.data;
        }, function (response) {
            console.log(response.data);
        });
    };


    var myCookies = {};
    $scope.setCookie = function (limit) {
        var expire = new Date(Date.now() + 60000), //set cookie to expire in 1 minute
            cookieString = "";
        myCookies.limitAvail = limit.toString();
        myCookies.user = $scope.user.email;
        for (var key in myCookies) {
            cookieString = key + "=" + myCookies[key] + "; expires=" + expire.toUTCString();
            document.cookie = cookieString;
        }
        console.log(expire);
        console.log(document.cookie);
    };

    $scope.getCookie = function () {
        var kv = document.cookie.split(";");
        for (var id in kv) {
            var cookie = kv[id].split("=");
            myCookies[cookie[0].trim()] = cookie[1];
        }

        var index = "limitAvail=" + myCookies["limitAvail"];

        if (document.cookie && document.cookie.indexOf(index) != -1) { //if cookie exists and is not expired
            if (myCookies.user == $scope.user.email) { //if the user in cookie matches logged in user
                $scope.availLimit = myCookies.limitAvail; //set the available limit to the one stored inside the cookie
            } else {
                $scope.availLimit = $scope.user.limit; //otherwise use the original limit
            }
        } else {
            $scope.availLimit = $scope.user.limit;
        }

        console.log(document.cookie.indexOf(index));
    }

    var today = new Date(),
        dd = String(today.getDate()).padStart(2, '0'),
        mm = String(today.getMonth() + 1).padStart(2, '0'),
        yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    User.users().then(function (response) {
        $scope.limit = parseFloat(response.limit);
    }, function (response) {
        console.log(response);
    });

    $scope.addExpense = function () {
        var balance = $scope.user.balance,
            todayChecked = document.getElementById('expToday').checked;

        var url = "api/add.php?type=expense&balance=" + balance,
            data = $scope.addExp;

        if (todayChecked === true && data.amount <= balance) { //if today checkbox is checked and balance is sufficient
            $scope.limit = $scope.limit - $scope.addExp.amount; //subtract the daily limit
            $scope.addExp.date = today; // set date to today
            $scope.setCookie($scope.limit); //set cookie
        }

        if (data.amount > balance) {
            alert('Insufficient Balance!');
        } else {
            $http.post(url, data).then(function (response) {
                alert(response.data);
                if (response.data === "Expense Added") {
                    $('.modal').modal('hide');
                    $('#addExpModal').on('hidden.bs.modal', function () {
                        $('.modal-body').find('input').val('');
                    });
                    $scope.loadData();
                }
            }, function (response) {
                console.log(response.data);
            });
        }

        $scope.changeTextClass();
    };

    $scope.addIncome = function () {
        var balance = $scope.user.balance,
            todayChecked = document.getElementById('incToday').checked;

        if (todayChecked === true) {
            $scope.addInc.date = today; //if today is checked set date to today
        }

        var url = "api/add.php?type=income&balance=" + balance,
            data = $scope.addInc;

        $http.post(url, data).then(function (response) {
            alert(response.data);
            if (response.data === "Income Added") {
                $('.modal').modal('hide');
                $('#addIncModal').on('hidden.bs.modal', function () {
                    $('.modal-body').find('input').val('');
                });
                $scope.loadData();
            }
        }, function (response) {
            console.log(response.data);
        });
    };

    $scope.delete = function (id, type) {
        var url = "api/delete.php?type=" + type + "&id=" + id;
        if (confirm("Are you sure you want to delete?")) {
            $http.delete(url).then(function (response) {
                alert(response.data);
                $route.reload();
            }, function (response) {
                console.log(response.data);
            });
        }
    };

    $scope.edit = function (id, index, name, amount, category, date, type) {
        var idd = 'editToday' + index;
        var todayChecked = document.getElementById(idd).checked,
            data,
            url = "api/edit.php?type=" + type + "&id=" + id;
        console.log(todayChecked);
        if (todayChecked) {
            date = today;
        }

        if (type === "expense") {
            $scope.userExpenses[index].name = name;
            $scope.userExpenses[index].amount = amount;
            $scope.userExpenses[index].category = category;
            $scope.userExpenses[index].date = date;
            data = $scope.userExpenses[index];
        } else if (type === "income") {
            $scope.userIncome[index].name = name;
            $scope.userIncome[index].amount = amount;
            $scope.userIncome[index].category = category;
            $scope.userIncome[index].date = date;
            data = $scope.userIncome[index];
        }

        if (confirm('Save changes?')) {
            $http.put(url, data).then(function (response) {
                alert(response.data);
            }, function (response) {
                console.log(response.data);
            });
        }
        $('.modal').modal('hide');
        $timeout(function () {
            $route.reload();
        }, 1000);
    };

    $scope.updateSetting = function () {
        var url = "api/edit.php?type=account",
            data = $scope.updateAcc;
        $http.put(url, data).then(function (response) {
            console.log(response.data);
            if (response.data) {
                alert(response.data);
                $scope.loadData();
            }
        }, function (response) {
            console.log(response.data);
        });
    };

    $scope.changeTextClass = function () {
        $('#limit').on('DOMSubtreeModified', function () {
            var value = $('#limit').html();
            var thrirtyPercent = 30 / 100 * $scope.user.limit;
            if (value < thrirtyPercent) { //toggle text class, if daily limit is below 30%, change to text-danger, otherwise text-success
                $('#limit').toggleClass('text-success text-danger');
                $('#currency').toggleClass('text-success text-danger');
            }
        });
    };

});

app.controller("expPaginationCtrl", function ($scope) {
    //pagination
    $scope.itemsPerPage = 3;
    $scope.currentPage = 0;

    $scope.pageCount = function () {
        if ($scope.userExpenses.length < 7) {
            return 2;
        } else {
            return Math.ceil($scope.userExpenses.length / $scope.itemsPerPage) - 1;
        }
    };

    //setting number for pagination button to be display
    $scope.range = function () {
        if ($scope.userExpenses.length < 7) {
            var rangeSize = 2;
        } else {
            rangeSize = 3;
        }
        var numForPagiBtns = [];
        var start = $scope.currentPage;
        if (start > $scope.pageCount() - rangeSize) {
            start = $scope.pageCount() - rangeSize + 1;
        }
        for (var i = start; i < start + rangeSize; i++) {
            numForPagiBtns.push(i);
        }
        if ($scope.userExpenses.length > 3) {
            return numForPagiBtns;
        } else {
            return null;
        }

    };


    //Set the current page to the number pressed by user in pagination
    $scope.setPage = function (n) {
        $scope.currentPage = n;
    };

    //Some navigating function for pagination 
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    $scope.prevPageDisabled = function () {
        return $scope.currentPage === 0 ? "disabled" : "";
    };
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };
    $scope.nextPageDisabled = function () {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };
});

app.controller("incPaginationCtrl", function ($scope) {
    //pagination
    $scope.itemsPerPage = 3;
    $scope.currentPage = 0;

    $scope.pageCount = function () {
        if ($scope.userIncome.length < 7) {
            return 2;
        } else {
            return Math.ceil($scope.userIncome.length / $scope.itemsPerPage) - 1;
        }
    };

    //setting number for pagination button to be display
    $scope.range = function () {
        if ($scope.userIncome.length < 7) {
            var rangeSize = 2;
        } else {
            rangeSize = 3;
        }

        var numForPagiBtns = [];
        var start = $scope.currentPage;
        if (start > $scope.pageCount() - rangeSize) {
            start = $scope.pageCount() - rangeSize + 1;
        }
        for (var i = start; i < start + rangeSize; i++) {
            numForPagiBtns.push(i);
        }
        if ($scope.userIncome.length > 3) {
            return numForPagiBtns;
        } else {
            return null;
        }
    };


    //Set the current page to the number pressed by user in pagination
    $scope.setPage = function (n) {
        $scope.currentPage = n;
    };

    //Some navigating function for pagination 
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    $scope.prevPageDisabled = function () {
        return $scope.currentPage === 0 ? "disabled" : "";
    };
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };
    $scope.nextPageDisabled = function () {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };
});
