/**
 * Created by beebe on 4/3/2017.
 */
angular.module(`app`).controller(`loginCtrl`, function($scope, mainService, $state) {
    const getUser = () =>{
        mainService.getUser().then(function (user) {
            if (user) {
                $scope.user = user.username;
                $scope.loggedIn = true;
                mainService.getGameListByUser().then(res =>{
                    $(document).ready(function(){
                        $('#collection-slide').slick({
                            draggable:true,
                            slidesToShow: 0,
                            slidesToScroll: 0,
                            autoplay: true,
                            autoplaySpeed: 1500,
                            prevArrow:`<br>`,
                            nextArrow:`<br>`,
                            responsive: [
                                {
                                    breakpoint: 480,
                                    settings: {
                                        prevArrow:`<br>`,
                                        nextArrow:`<br>`,
                                        draggable:true,
                                        slidesToShow: 1,
                                        slidesToScroll: 1
                                    }
                                }
                            ]
                        });
                    });
                    $scope.userGames = res.data
                })
            }
            else   $scope.user = 'You\'re not logged in. in order to save a collection you will need to create an account or log in with Gmail, Facebook, Twitter or Linkedin.';
        })
    };
    getUser();



    $scope.logout = mainService.logout;




});



