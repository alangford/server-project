/**
 * Created by beebe on 4/3/2017.
 */
angular.module(`app`).controller(`homeCtrl`, function($scope,mainService, $stateParams){
    $scope.searching = false;
    const getUser = () =>{
        mainService.getUser().then(function (user) {
            if (user) {
                $scope.loggedIn = true
            }
            else   $scope.loggedIn = false
        })
    };
    getUser();
    $scope.search =  (st)=>{
        $scope.loading = true;
        $scope.st = ``;
        $scope.searching = true;
        if(st.length > 4 && st !== ``){
            mainService.getGameList(st).then(re =>{
                $scope.gameslist = re;
                $scope.loading = false;
            })
        }
        else{
            alert(`Sorry you have to be more specific`);
            $scope.loading = false;
        }
    };


});