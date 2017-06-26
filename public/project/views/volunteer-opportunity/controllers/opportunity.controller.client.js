(function () {
    angular
        .module('Handouts')
        .controller('volunteerOpportunityController', volunteerOpportunityController);

    function volunteerOpportunityController($location, currentUser, opportunityService, $routeParams) {

        var model = this;

        model.currentUser = currentUser;
        var projectId = $routeParams.projectId;
        model.projectId = projectId;
        // model.volunteer = model.currentUser._id;

        if($routeParams.opportunityId) {
            var opportunityId = $routeParams.opportunityId;
            model.opportunityId = opportunityId;
        }


        model.createOpportunity = createOpportunity;
        model.getOpportunityById = getOpportunityById;
        model.updateOpportunity = updateOpportunity;
        model.deleteOpportunity = deleteOpportunity;
        model.addVolunteer = addVolunteer;

        function init() {
            // model.volunteering = false;
            getOpportunityById(opportunityId);
        }

        init();

        function addVolunteer() {
            opportunityService.
                addVolunteer(model.currentUser, opportunityId)
                    .then(function (response) {
                        model.message = "Congratulations! you are a part of our team now."
                    }, function (err) {
                        model.error = "Something went wrong!"
                    })
        }

        function deleteOpportunity() {
            opportunityService
                .deleteOpportunity(model.opportunityId)
                .then(function (response) {
                    $location.url('organization/projects');
                }, function () {
                    model.error = "Something went wrong. Opportunity deletion unsuccessfull!"
                });
        }

        function updateOpportunity() {
            var startDate = new Date(model.opportunity.startDate);
            var endDate   = new Date(model.opportunity.endDate);
            var today = new Date();

            if (startDate > endDate){
                model.error= 'Start Date cannot occur after end Date';
                return;
            }
            else if (startDate < today || endDate < today) {
                model.error= "Start date or End Date cannot be before Current Date";
                return;
            }

            opportunityService
                .updateOpportunity(opportunityId, model.opportunity)
                .then(function (response) {
                    model.message = "Opportunity Successfully Updated!";
                    model.error = null;
                }, function (err) {
                    model.error = "Uh Oh! Something went wrong.";
                    model.message = null;
                });
        }

        function getOpportunityById(opportunityId) {
            opportunityService
                .getOpportunityById(opportunityId)
                .then(function (opp) {
                    model.opportunity = opp;
                    model.opportunity.startDate = new Date(model.opportunity.startDate);
                    model.opportunity.endDate = new Date(model.opportunity.endDate);
                })

        }


        function createOpportunity(opportunity) {


            // if((user.username === null && user.password === null) ||
            //     (user.username === '' && user.password === '') ||
            //     (typeof user.username === 'undefined' && typeof user.password === 'undefined')) {
            //     model.error = 'username and password is required';
            //     return;
            // }
            //
            // if(user.username === null || user.username === '' || typeof user.username === 'undefined') {
            //     model.error = 'username is required';
            //     return;
            // }
            //
            // if(user.password === null || user.password === '' || typeof user.password === 'undefined') {
            //     model.error = 'password is required';
            //     return;
            // }
            //
            // if(user.password !== user.cpassword || user.password === null || typeof user.password === 'undefined') {
            //     model.error = "Passwords doesn't match, Try Again";
            //     return;
            // }
            //
            // if(user.role === "ORGANIZATION") {
            //     if((user.organization === null && user.registrationNumber === null) ||
            //         (user.organization === '' && user.registrationNumber === '') ||
            //         (typeof user.organization === 'undefined' && typeof user.registrationNumber === 'undefined')) {
            //         model.error = 'Organization name and its registration number is required';
            //         return;
            //     }
            //
            //     if(user.organization === null || user.organization === '' || typeof user.organization === 'undefined') {
            //         model.error = 'Organization name is required';
            //         return;
            //     }
            // }


            model.opportunity._createdBy = model.currentUser._id;
            console.log(opportunity);
            opportunityService
                .createOpportunity(opportunity, projectId)
                .then(function () {
                    $location.url("/organization/opportunity/all");
                });
        }
    }
})();