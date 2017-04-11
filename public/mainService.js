/**
 * Created by beebe on 4/2/2017.
 */
angular.module(`app`).service(`mainService`, function($http){

    this.getBgs = () =>{
        return $http({
            method:`GET`,
            url:`/randomName`
        })
    };

    this.getWhatsHot = () =>{
        return $http({
            method:`GET`,
            url:`/games/gamelist`
        }).then(res=>{
            return res.data.items.item
        })
    };
    this.getGameList = st =>{
        return $http({
            method:`GET`,
            url:`/games/gamelist/${st}`
        })
            .then(res => {
                let list = res.data.boardgames.boardgame;
                for(let i =0;i<list.length;i++){
                    if(list[i].name[0]._){
                        list[i].name = list[i].name[0]._
                    }
                    else list[i].name = list[i].name[0]
                }
                return list
        })
    };

    this.getGame = game =>{
        return $http({
            method:`GET`,
            url:`/games/gamesbyid/${game}`
        }).then((res) =>{
            let game = res.data.boardgames.boardgame[0];
            for (let i =0;i<game.name.length; i++){
                if(game.name[i].$.primary){
                    game.name =  game.name[i]._;
                    break
                }
            }
            game.description[0] = game.description[0].split(`<br/>`).join(` `).split(`&quot`).join(` `).split(`&ouml;`).join(` `).split(`&rdquo;`).join(` `).split(`&ldquo;`).join(` `).split(`&rsquo;`).join(` `).split(`&ndash;`).join(` `);
            return game
        })
    };

    this.getGameReview = st =>{
        return $http({
            method:`GET`,
            url:`games/gamebyid/review/${st}`
        })
    };

    this.getRules = id =>{
        return $http({
            method:`GET`,
            url:`/games/rules/${id}`
        })
    };

    this.addData = (gameId,name,img,desc,average,min,max,cat) =>{
        return $http({
            method:`POST`,
            url:`/user/savegames`,
            data:{gameId,name, img, desc, average, min, max,cat}
        })
    };

    this.getGameListByUser = () =>{
        return $http({
            method:`GET`,
            url:`/user/savegames`
        })
    };
    this.hasGame = (id) =>{
        return $http({
            method:`GET`,
            url:`/user/savegames/${id}`
        })
    };

    this.deleteGame  = id =>{
        return $http({
            method:`DELETE`,
            url:`/user/savegames/${id}`
        })
    };

    this.addReviews = (objectid,review,stars)=>{
      return $http({
          method:`POST`,
          url:`/user/reviews`,
          data:{objectid,review,stars}
      })
    };
    this.getReviews = objectid =>{
        return $http({
            method:`GET`,
            url:`/user/reviews/${objectid}`
        })
    };


    this.getUser = function() {
        return $http({
            method: 'GET',
            url: '/auth/me'
        })
            .then(function(res) {
                return res.data;
            })
            .catch(function(err) {
                console.log(err);
            })
    };

    this.logout = function() {
        return $http({
            method: 'GET',
            url: '/auth/logout'
        })
            .then(function(res) {
                return res.data;
            })
            .catch(function(err) {
                console.log(err);
            })
    }
});