/**
 * Created by beebe on 4/4/2017.
 */
angular.module(`app`).directive(`randomeNameDirect`,mainService =>{
   return{
       restrict:`E`,
       template:`<span>{{BGS}}</span>`,
       link:(scope,ele,attr) =>{
           const getName = () =>{
               let random = Math.floor((Math.random() * 37) + 1);
               let random2 = Math.floor((Math.random() * 37) + 1);
               let random3 = Math.floor((Math.random() * 37) + 1);
               mainService.getBgs().then(res =>{
                   scope.BGS = res.data[random].b[0].toUpperCase() + res.data[random].b.slice(1) + " " + res.data[random2].g[0].toUpperCase() + res.data[random2].g.slice(1) + " " + res.data[random3].s[0].toUpperCase() + res.data[random3].s.slice(1);

               })
           };
           getName()
       }
   }
});