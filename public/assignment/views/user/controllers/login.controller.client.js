(function () {
    angular
        .module('WAM') // Here, only reading the module
        .controller('loginController',loginController);

    function  loginController($location, userService) {
        var model = this;

        //Event Handlers
        model.login = login;

        function login (username, password) {
            //var found = userService.findUserByCredentials(username, password);
            userService
                .findUserByCredentials(username, password)
                .then(renderLogin, loginError);

            function renderLogin(found) {
                $location.url('/user/' + found._id)

                // if(found !== null)  {
                //     $location.url('/user/' + found._id)
                // } else {
                //     model.message = "Sorry " + username + " not found, please try again";
                // }
            }

            function loginError() {
                model.message = "Sorry " + username + " not found, please try again";
            }

        }
    }
}) ();