(function () {
    angular
        .module('WAM')
        .controller('widgetListController', widgetListController);

    function widgetListController($sce,
                                  $routeParams,
                                  widgetService,
                                  $location) {
        var model = this;

        var userId =  $routeParams.userId;
        model.userId = userId;
        var websiteId = $routeParams.websiteId;
        model.websiteId = websiteId;
        var pageId = $routeParams.pageId;
        model.pageId = pageId;


        model.trust = trust;
        model.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        model.widgetUrl = widgetUrl;
        model.widgetEditUrl = widgetEditUrl;

        function init() {
            var widgets = widgetService.findWidgetsByPageId(pageId);
            model.widgets = widgets;
        }

        init();

        function widgetEditUrl(widget) {
            var url = 'views/widget/templates/editor/widget-'+widget.widgetType.toLowerCase()+'-edit.view.client.html';
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget" + widget.widgetType.toLowerCase());
        }

        function widgetUrl(widget) {
            var url = 'views/widget/templates/widget-'+widget.widgetType.toLowerCase()+'.view.client.html';
            return url;
        }

        function getYouTubeEmbedUrl(linkUrl) {
             var embedUrl="https://www.youtube.com/embed/";
             var linkUrlParts = linkUrl.split('/');
             embedUrl += linkUrlParts[linkUrlParts.length - 1];
             return $sce.trustAsResourceUrl(embedUrl);
        }

        function trust(html) {
            return $sce.trustAsHtml(html);

        }


    }
})();