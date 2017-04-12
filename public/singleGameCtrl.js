/**
 * Created by beebe on 4/3/2017.
 */
angular.module(`app`).controller(`singleGameCtrl`,function($scope, mainService, $stateParams){
    const getUser = () =>{
        mainService.getUser().then(function (user) {
            if (user) {
                $scope.loggedIn = true;
                mainService.hasGame($stateParams.id).then(res=>{

                    if(res.data[0]) $scope.inCollection = true;
                    else $scope.inCollection = false
                })
            }
            else   $scope.loggedIn = false
        })
    };
    getUser();
        mainService.getGame($stateParams.id).then((res) => {
            mainService.getRules($stateParams.id).then(res=>{
                if(!res.data[0]){
                    $scope.thereisrules = ["There are currently no rules for this game in the system.", false]
            }
                else {
                    $scope.rules = res.data[0].rulesurl;
                    $scope.thereisrules = [`We have the rules!`, true];
                }
            });
            mainService.getGameReview(res.name + ` Review`).then(result=>{
                $scope.videoID = result.data[0].id.videoId
            });
            mainService.getReviews($stateParams.id).then(re => {
               if(re){ let totalReview = 0;
                   for(let i=0;i<re.data.length;i++){
                       totalReview += re.data[i].stars
                   }
                   $scope.avg = totalReview / re.data.length;
                   $scope.reviews = re.data}
                   else console.log(`err`)
            });
            $scope.game = res
        });




        $scope.addToData = (gameId,name,thumbnail,description,year,minPlayers,maxPlayers,boardgamecategory) =>{
            if(boardgamecategory){
                let newCategory = []
                for(let i=0;i<boardgamecategory.length;i++){
                    newCategory.push(boardgamecategory[i]._)
                }
                mainService.addData(gameId,name,thumbnail,description,year,minPlayers,maxPlayers,newCategory).then(() =>{
                   console.log(`i work`)
                    $scope.inCollection = true;
                })
            }
            else mainService.addData(gameId,name,thumbnail,description,year,minPlayers,maxPlayers,boardgamecategory).then(() =>{
                $scope.inCollection = true;
            })
        };
        $scope.deleteUserGame = (id) =>{
            mainService.deleteGame(id).then(()=>{
                $scope.inCollection = false
            })
    }

    $scope.addReview = (objectid,review,stars) =>{
            if(review.length > 10){
                let time = moment().format(`MMMM Do YYYY, h:mm:ss a`);
                mainService.addReviews(objectid,review,stars,time).then(()=> {
                    mainService.getReviews(objectid).then(re => {
                        let totalReview = 0;
                        for(let i=0;i<re.data.length;i++){
                            totalReview += re.data[i].stars
                        }
                        $scope.review = ``;
                        $scope.avg = totalReview / re.data.length;
                        console.log(re.data)
                        $scope.reviews = re.data;
                    })
                })
            }
            else alert(`Your review must be at least 10 characters.`)
    }

});