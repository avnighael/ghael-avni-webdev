(function() {
    angular
        .module('WAM')
        .service('websiteService', websiteService);

    function websiteService() {

        this.findAllWebsitesForUser = findAllWebsitesForUser;
        this.findWebsiteById = findWebsiteById;
        this.deleteWebsite = deleteWebsite;
        this.createWebsite = createWebsite;
        this.updateWebsite = updateWebsite;

        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem" },
            { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem" },
            { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem" },
            { "_id": "890", "name": "Go",          "developerId": "123", "description": "Lorem" },
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
            { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem" },
            { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem" }
        ];

        function updateWebsite(websiteId, website) {
            for(var w in websites) {
                if(websites[w]._id === websiteId) {
                    websites[w] = angular.copy(website);
                    return websites[w];
                }
            }
            return null;
        }

        function createWebsite(website) {
            website._id = (new Date()).getTime() + "";
            websites.push(website);
        }

        function deleteWebsite(websiteId) {
            for(var w in websites) {
                if(websites[w]._id === websiteId) {
                    var website = findWebsiteById(websiteId);
                    var index = websites.indexOf(website);
                    websites.splice(index,1);
                    return angular.copy(website);
                }
            }
            return null;
        }

        function findWebsiteById(websiteId) {
            for (var w in websites) {
                var website=websites[w]
                if (website._id === websiteId) {
                    return angular.copy(website);
                }
            }
            return null;
        }

        function findAllWebsitesForUser(userId) {
            var results = [];

            for(var w in websites) {
                if(websites[w].developerId === userId) {
                    websites[w].created = new Date();
                    websites[w].lastAccessed = new Date();
                    results.push(websites[w]);
                }
            }

            return results;
        }

    }
})();
