/**
 * Created by beebe on 4/2/2017.
 */
angular.module(`app`, [`ui.router`,`ngYoutubeEmbed`]).config(($urlRouterProvider,$stateProvider) => {
    $urlRouterProvider.when(``, `/`);

    $stateProvider
        .state(`home`, {
            templateUrl: `views/home.html`,
            url: `/`,
            controller:`homeCtrl`
        })
        .state(`contact`, {
            templateUrl: `views/contact.html`,
            url: `/contact`
        })
        .state(`singleGame`,{
            templateUrl:`views/singleGame.html`,
            url:`/games/:id`,
            controller:`singleGameCtrl`
        })
        .state(`login`, {
            templateUrl:`views/login.html`,
            url:`/login`,
            controller: `loginCtrl`
        })
        .state(`payment`,{
            templateUrl:`views/paymentSuccess.html`,
            url:`/paymentSuccess`,
        })
});