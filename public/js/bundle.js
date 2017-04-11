"use strict";

/**
 * Created by beebe on 4/2/2017.
 */
angular.module("app", ["ui.router", "ngYoutubeEmbed"]).config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when("", "/");

    $stateProvider.state("home", {
        templateUrl: "views/home.html",
        url: "/",
        controller: "homeCtrl"
    }).state("contact", {
        templateUrl: "views/contact.html",
        url: "/contact"
    }).state("singleGame", {
        templateUrl: "views/singleGame.html",
        url: "/games/:id",
        controller: "singleGameCtrl"
    }).state("login", {
        templateUrl: "views/login.html",
        url: "/login",
        controller: "loginCtrl"
    }).state("payment", {
        templateUrl: "views/paymentSuccess.html",
        url: "/paymentSuccess"
    });
});
"use strict";

/**
 * Created by beebe on 4/3/2017.
 */
angular.module("app").controller("homeCtrl", function ($scope, mainService, $stateParams) {
    $scope.searching = false;
    var getUser = function getUser() {
        mainService.getUser().then(function (user) {
            if (user) {
                $scope.loggedIn = true;
            } else $scope.loggedIn = false;
        });
    };
    getUser();
    $scope.search = function (st) {
        $scope.loading = true;
        $scope.st = "";
        $scope.searching = true;
        if (st.length > 4 && st !== "") {
            mainService.getGameList(st).then(function (re) {
                $scope.gameslist = re;
                $scope.loading = false;
            });
        } else {
            alert("Sorry you have to be more specific");
            $scope.loading = false;
        }
    };
});
'use strict';

/**
 * Created by beebe on 4/3/2017.
 */
angular.module('app').directive('hotDirect', function (mainService, $stateParams) {

    return {
        restrict: 'E',
        templateUrl: 'views/hot.html',
        link: function link(scope, ele, attr) {

            mainService.getWhatsHot().then(function (res) {
                scope.whatsHot = res;
                $(document).ready(function () {
                    $('#slider').slick({
                        vertical: true,
                        draggable: false,
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 1500,
                        prevArrow: '<button class="btn btn-primary center" style="display: block;  padding: 1vh 5vw 1vh 5vw"><i class="fa fa-arrow-up" aria-hidden="true"></i></button>',
                        nextArrow: '<button class="btn btn-primary center" style="display: block; padding: 1vh 5vw 1vh 5vw"><i class="fa fa-arrow-down" aria-hidden="true"></i></button>',
                        responsive: [{
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1
                            }
                        }, {
                            breakpoint: 768,
                            settings: {
                                prevArrow: '<br>',
                                nextArrow: '<br>',
                                draggable: true,
                                vertical: false,
                                slidesToShow: 3,
                                slidesToScroll: 2
                            }
                        }, {
                            breakpoint: 480,
                            settings: {
                                prevArrow: '<br>',
                                nextArrow: '<br>',
                                draggable: true,
                                vertical: false,
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }]
                    });
                });
            });
        }
    };
});
'use strict';

/**
 * Created by beebe on 4/3/2017.
 */
angular.module('app').controller('loginCtrl', function ($scope, mainService, $state) {
    var getUser = function getUser() {
        mainService.getUser().then(function (user) {
            if (user) {
                $scope.user = user.username;
                $scope.loggedIn = true;
                mainService.getGameListByUser().then(function (res) {
                    $(document).ready(function () {
                        $('#collection-slide').slick({
                            draggable: true,
                            slidesToShow: 5,
                            slidesToScroll: 1,
                            autoplay: true,
                            autoplaySpeed: 1500,
                            prevArrow: '<br>',
                            nextArrow: '<br>',
                            responsive: [{
                                breakpoint: 480,
                                settings: {
                                    prevArrow: '<br>',
                                    nextArrow: '<br>',
                                    draggable: true,
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }]
                        });
                    });
                    $scope.userGames = res.data;
                });
            } else $scope.user = 'You\'re not logged in. in order to save a collection you will need to create an account or log in with Gmail, Facebook, Twitter or Linkedin.';
        });
    };
    getUser();

    $scope.logout = mainService.logout;
});
'use strict';

/**
 * Created by beebe on 4/2/2017.
 */
angular.module('app').service('mainService', function ($http) {

    this.getBgs = function () {
        return $http({
            method: 'GET',
            url: '/randomName'
        });
    };

    this.getWhatsHot = function () {
        return $http({
            method: 'GET',
            url: '/games/gamelist'
        }).then(function (res) {
            return res.data.items.item;
        });
    };
    this.getGameList = function (st) {
        return $http({
            method: 'GET',
            url: '/games/gamelist/' + st
        }).then(function (res) {
            var list = res.data.boardgames.boardgame;
            for (var i = 0; i < list.length; i++) {
                if (list[i].name[0]._) {
                    list[i].name = list[i].name[0]._;
                } else list[i].name = list[i].name[0];
            }
            return list;
        });
    };

    this.getGame = function (game) {
        return $http({
            method: 'GET',
            url: '/games/gamesbyid/' + game
        }).then(function (res) {
            var game = res.data.boardgames.boardgame[0];
            for (var i = 0; i < game.name.length; i++) {
                if (game.name[i].$.primary) {
                    game.name = game.name[i]._;
                    break;
                }
            }
            game.description[0] = game.description[0].split('<br/>').join(' ').split('&quot').join(' ').split('&ouml;').join(' ').split('&rdquo;').join(' ').split('&ldquo;').join(' ').split('&rsquo;').join(' ').split('&ndash;').join(' ');
            return game;
        });
    };

    this.getGameReview = function (st) {
        return $http({
            method: 'GET',
            url: 'games/gamebyid/review/' + st
        });
    };

    this.getRules = function (id) {
        return $http({
            method: 'GET',
            url: '/games/rules/' + id
        });
    };

    this.addData = function (gameId, name, img, desc, average, min, max, cat) {
        return $http({
            method: 'POST',
            url: '/user/savegames',
            data: { gameId: gameId, name: name, img: img, desc: desc, average: average, min: min, max: max, cat: cat }
        });
    };

    this.getGameListByUser = function () {
        return $http({
            method: 'GET',
            url: '/user/savegames'
        });
    };
    this.hasGame = function (id) {
        return $http({
            method: 'GET',
            url: '/user/savegames/' + id
        });
    };

    this.deleteGame = function (id) {
        return $http({
            method: 'DELETE',
            url: '/user/savegames/' + id
        });
    };

    this.addReviews = function (objectid, review, stars) {
        return $http({
            method: 'POST',
            url: '/user/reviews',
            data: { objectid: objectid, review: review, stars: stars }
        });
    };
    this.getReviews = function (objectid) {
        return $http({
            method: 'GET',
            url: '/user/reviews/' + objectid
        });
    };

    this.getUser = function () {
        return $http({
            method: 'GET',
            url: '/auth/me'
        }).then(function (res) {
            return res.data;
        }).catch(function (err) {
            console.log(err);
        });
    };

    this.logout = function () {
        return $http({
            method: 'GET',
            url: '/auth/logout'
        }).then(function (res) {
            return res.data;
        }).catch(function (err) {
            console.log(err);
        });
    };
});
"use strict";

/**
 * Created by beebe on 4/4/2017.
 */
angular.module("app").directive("randomeNameDirect", function (mainService) {
    return {
        restrict: "E",
        template: "<span>{{BGS}}</span>",
        link: function link(scope, ele, attr) {
            var getName = function getName() {
                var random = Math.floor(Math.random() * 37 + 1);
                var random2 = Math.floor(Math.random() * 37 + 1);
                var random3 = Math.floor(Math.random() * 37 + 1);
                mainService.getBgs().then(function (res) {
                    scope.BGS = res.data[random].b[0].toUpperCase() + res.data[random].b.slice(1) + " " + res.data[random2].g[0].toUpperCase() + res.data[random2].g.slice(1) + " " + res.data[random3].s[0].toUpperCase() + res.data[random3].s.slice(1);
                });
            };
            getName();
        }
    };
});
"use strict";

/**
 * Created by beebe on 4/3/2017.
 */
angular.module("app").controller("singleGameCtrl", function ($scope, mainService, $stateParams) {
    var getUser = function getUser() {
        mainService.getUser().then(function (user) {
            if (user) {
                $scope.loggedIn = true;
                mainService.hasGame($stateParams.id).then(function (res) {

                    if (res.data[0]) $scope.inCollection = true;else $scope.inCollection = false;
                });
            } else $scope.loggedIn = false;
        });
    };
    getUser();
    mainService.getGame($stateParams.id).then(function (res) {
        mainService.getRules($stateParams.id).then(function (res) {
            if (!res.data[0]) {
                $scope.thereisrules = ["There are currently no rules for this game in the system.", false];
            } else {
                $scope.rules = res.data[0].rulesurl;
                $scope.thereisrules = ["We have the rules!", true];
            }
        });
        mainService.getGameReview(res.name + " Review").then(function (result) {
            $scope.videoID = result.data[0].id.videoId;
        });
        mainService.getReviews($stateParams.id).then(function (re) {
            if (re) {
                var totalReview = 0;
                for (var i = 0; i < re.data.length; i++) {
                    totalReview += re.data[i].stars;
                }
                $scope.avg = totalReview / re.data.length;
                $scope.reviews = re.data;
            } else console.log("err");
        });
        $scope.game = res;
    });

    $scope.addToData = function (gameId, name, thumbnail, description, year, minPlayers, maxPlayers, boardgamecategory) {
        if (boardgamecategory) {
            var newCategory = [];
            for (var i = 0; i < boardgamecategory.length; i++) {
                newCategory.push(boardgamecategory[i]._);
            }
            mainService.addData(gameId, name, thumbnail, description, year, minPlayers, maxPlayers, newCategory).then(function () {
                console.log("i work");
                $scope.inCollection = true;
            });
        } else mainService.addData(gameId, name, thumbnail, description, year, minPlayers, maxPlayers, boardgamecategory).then(function () {
            $scope.inCollection = true;
        });
    };
    $scope.deleteUserGame = function (id) {
        mainService.deleteGame(id).then(function () {
            $scope.inCollection = false;
        });
    };

    $scope.addReview = function (objectid, review, stars) {
        if (review.length > 10) {
            mainService.addReviews(objectid, review, stars).then(function () {
                mainService.getReviews(objectid).then(function (re) {
                    var totalReview = 0;
                    for (var i = 0; i < re.data.length; i++) {
                        totalReview += re.data[i].stars;
                    }
                    $scope.review = "";
                    $scope.avg = totalReview / re.data.length;
                    $scope.reviews = re.data;
                });
            });
        } else alert("Your review must be at least 10 characters.");
    };
});
//# sourceMappingURL=bundle.js.map
