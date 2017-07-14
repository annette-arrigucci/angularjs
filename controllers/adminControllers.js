angular.module("sportsStoreAdmin")
.constant("authUrl", "https://sportsstore.herokuapp.com/users/login")
.constant("ordersUrl", "https://sportsstore.herokuapp.com/orders")
.controller("authCtrl", function ($scope, $http, $location, authUrl) {
    $scope.authenticate = function (user, pass) {
        var authInfo = { username: user, password: pass };

        $http({
            method: 'POST',
            url: authUrl,
            username: user,            
            data: authInfo
        }, {
            withCredentials: true
        }).then(function (response) {
            $location.path("/main");
        }, function (error) {
            $scope.authenticationError = error;
        });
    }
})
.controller("mainCtrl", function ($scope) {
    $scope.screens = ["Products", "Orders"];
    $scope.current = $scope.screens[0];

    $scope.setScreen = function (index) {
        $scope.current = $scope.screens[index];
    };

    $scope.getScreen = function () {
        return $scope.current == "Products" ? "/angularjs/views/adminProducts.html" : "/angularjs/views/adminOrders.html";
    };
})
.controller("ordersCtrl", function ($scope, $http, ordersUrl) {
    $http({
        method: 'GET',
        url: ordersUrl,
    }, {
        withCredentials: true
    }).then(function (response) {
            $scope.orders = response.data;
        }, function (error) {
            $scope.error = error;
        });
    $scope.selectedOrder;
    $scope.selectOrder = function (order) {
        $scope.selectedOrder = order;
    };

    $scope.calcTotal = function (order) {
        var total = 0;
        for (var i = 0; i < order.products.length; i++) {
            total += order.products[i].count * order.products[i].price;
        }
        return total;
    }
});