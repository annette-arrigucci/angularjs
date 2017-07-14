// JavaScript source code
angular.module("sportsStore")
    .constant("dataUrl", "https://sportsstore.herokuapp.com/products")
    .constant("orderUrl", "https://sportsstore.herokuapp.com/orders")
    .controller("sportsStoreCtrl", function ($scope, $http, $location, dataUrl, orderUrl, cart) {
        $scope.data = {};
        $scope.data.products = [];

        $scope.matchPattern = new RegExp("[a-zA-z\s]");
        $scope.matchPatternNumbers = new RegExp("[0-9]");

        $http({
            method: 'GET',
            url: dataUrl
        }).then(function (response) {
            $scope.data.products = response.data;
        }, function (error) {
            $scope.data.error = error;
        });

        $scope.sendOrder = function (shippingDetails) {
            if ($scope.shippingForm.$valid) {
                var order = angular.copy(shippingDetails);
                //var orderId = "";
                //order.products = [];
                order.products = cart.getProducts();
                $http({
                    method: 'POST',
                    url: orderUrl,
                    data: order
                }).then(function (response) {
                    $scope.data.orderId = response.data.id;
                    cart.getProducts().length = 0;
                }, function (error) {
                    $scope.data.orderError = error;
                }).finally(function () {
                    $location.path('/complete');
                });
            }
            else {
                $scope.showValidation = true;
            }
        }
        $scope.getError = function (error) {
            if (angular.isDefined(error)) {
                var message = "";
                if (error.required) {
                    message += "Please enter a value\n";
                }
                if (error.email) {
                    message += "Please enter a valid email address\n";
                }
                if (error.minlength || error.maxlength) {
                    message += "Check length of input\n";
                }
                if (error.pattern) {
                    message += "Input type not valid\n";
                }
                
                return message;
            }
        }
 });
