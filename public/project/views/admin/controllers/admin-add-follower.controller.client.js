(function () {
    angular
        .module("Handouts")
        .controller("AdminAddFollowerController", AdminAddFollowerController);

    function AdminAddFollowerController(adminService, currentUser, userService, $location, $routeParams) {

        var model = this;

        model.currentUser = currentUser;
        var thisUserId = $routeParams.userId;
        model.thisUserId = thisUserId;

        model.follow = follow;
        model.logout = logout;


        function init() {
            getAllDonors();
            getUserById(thisUserId);
        }

        init();

        function logout(user){
            userService
                .logout()
                .then(function () {
                    $location.url('/');
                })
        }

        function follow(donor) {
            userService
                .follow(model.thisUserId, donor._id)
                .then(function (followers) {
                    getUserById(thisUserId);
                    model.message="Follower Successfully added";
                    console.log(model.thisUser);
                    donor.followers.push(followers);
                    model.followed = true;
                })
        }

        function getAllDonors() {
            adminService
                .getAllDonors()
                .then(function (allDonors) {
                    model.allDonors = allDonors;
                }, function (err) {
                    console.log(err);
                });
        }


        function getUserById(thisUserId) {
            adminService
                .getUserById(thisUserId)
                .then(function (thisUser) {
                    // console.log(model.thisUserId);
                    model.thisUser = thisUser;
                }, function (err) {
                    console.log(err);
                })
        }

        // function removeFromFollower(user) {
        //     adminService
        //         .unfollow(thisUserId, user._id)
        //         .then(function (response) {
        //             console.log(response);
        //             var followerIndex = user.followers.map(function(x){
        //                 return x._id;})
        //                 .indexOf(user._id);
        //             user.followers.splice(followerIndex,1);
        //             model.followed = false;
        //             getUserById(model.thisUserId);
        //         }, function (err) {
        //             console.log(err);
        //         })
        // }




    }
})();