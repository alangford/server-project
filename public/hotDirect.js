/**
 * Created by beebe on 4/3/2017.
 */
angular.module(`app`).directive(`hotDirect`,(mainService,$stateParams)=>{

    return {
        restrict:`E`,
        templateUrl:`views/hot.html`,
        link:(scope,ele,attr)=>{

            mainService.getWhatsHot().then((res)=>{
                scope.whatsHot = res;
                $(document).ready(function(){
                    $('#slider').slick({
                        vertical: true,
                        draggable:false,
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 1500,
                        prevArrow:`<button class="btn btn-primary center" style="display: block;  padding: 1vh 5vw 1vh 5vw"><i class="fa fa-arrow-up" aria-hidden="true"></i></button>`,
                        nextArrow:`<button class="btn btn-primary center" style="display: block; padding: 1vh 5vw 1vh 5vw"><i class="fa fa-arrow-down" aria-hidden="true"></i></button>`,
                        responsive: [
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 1,
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    prevArrow:`<br>`,
                                    nextArrow:`<br>`,
                                    draggable:true,
                                    vertical: false,
                                    slidesToShow: 3,
                                    slidesToScroll: 2
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    prevArrow:`<br>`,
                                    nextArrow:`<br>`,
                                    draggable:true,
                                    vertical: false,
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });
                });
            });




                }
        }

});