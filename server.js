/**
 * Created by beebe on 3/31/2017.
 */
const express = require(`express`);
const app = module.exports = express();
const axios = require(`axios`);
const xmlToJSON = require("xml2js").parseString;
const session = require(`express-session`);
const bodyParser = require(`body-parser`);
const cors = require(`cors`);
const massive = require(`massive`);
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const corsOptions = {origin: 'http://localhost:3001'};
const config = require(`./.config.js`);
const stripe = require(`stripe`)(config.stripe);
const massiveInstance = massive.connectSync({connectionString : config.connectionString});




app.set("db", massiveInstance);
const db = app.get(`db`);
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(`public`));

passport.use(new Auth0Strategy({
        domain:       config.auth0.domain,
        clientID:     config.auth0.clientID,
        clientSecret: config.auth0.clientSecret,
        callbackURL:  '/auth/callback'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        db.getUserByAuthId([profile.id], function(err, user) {
            user = user[0];
            if (!user) { //if there isn't one, we'll create one!
                console.log('CREATING USER');
                db.createUserByAuth([profile.displayName, profile.id], function(err, user) {
                    console.log('USER CREATED');
                    return done(err, user[0]); // GOES TO SERIALIZE USER
                })
            } else { //when we find the user, return it
                console.log('FOUND USER');
                return done(err, user);
            }
        })
    }
));

//THIS IS INVOKED ONE TIME TO SET THINGS UP
passport.serializeUser(function(userA, done) {
    console.log('serializing');
    let userB = userA;
    //Things you might do here :
    //Serialize just the id, get other information to a+dd to session,
    done(null, userB); //PUTS 'USER' ON THE SESSION
});

//USER COMES FROM SESSION - THIS IS INVOKED FOR EVERY ENDPOINT
passport.deserializeUser(function(userB, done) {
    let userC = userB;
    //Things you might do here :
    // Query the database with the user id, get other information to put on req.user
    done(null, userC); //PUTS 'USER' ON REQ.USER
});



app.get('/auth', passport.authenticate('auth0'));




app.get('/auth/callback',
    passport.authenticate('auth0', {successRedirect: '/#!/login'}), function(req, res) {
        res.status(200).send(req.user);
    });

app.get('/auth/me', function(req, res) {
    if (!req.user) return res.sendStatus(404);
    //THIS IS WHATEVER VALUE WE GOT FROM userC variable above.
    res.status(200).send(req.user);
});

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.post(`/charge`, (req,res,next)=>{
    let token = req.body.stripeToken
    let chargeAmount = req.body.chargeAmount
    let charge = stripe.charges.create({
        amount: chargeAmount,
        currency: `usd`,
        source: token
    },(err, charge)=>{
        if(err && err.type === `StripeCardError`) console.log(`Your card was declined`)

    });
    res.redirect((`/#!/paymentSuccess`))
});

app.get(`/randomName`,(req,res,next)=>{
   db.run(`select b,g,s FROM bgs`, (err,re)=>{
       if(re){
           res.status(200).json(re)
       }
       else res.status(403).send(err)
   })
});

app.get(`/user/savegames`,(req,res,next)=>{
    db.run(`SELECT id,name,imgurl,description,year,minplay,maxplay,category FROM boardgames b
        JOIN users u on b.savegame = u.userid
        where userid = $1`, [req.user.userid], (err, re)=>{
        if (re){
            res.status(200).json(re)
        }
        else res.status(403).send(err)
    })
});
app.post(`/user/savegames`,(req, res, next)=>{
    db.run(`INSERT INTO boardgames(id, name, imgurl, description,year,minplay,maxplay,savegame,category) 
            VAlUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [req.body.gameId, req.body.name, req.body.img, req.body.desc,req.body.average,req.body.min,req.body.max,req.user.userid, req.body.cat], (err, re)=>{
        if (re) res.status(200).send(`ok`);
        else res.status(403).send(err)
    })
});

app.get(`/user/savegames/:id`,(req,res,next) =>{
    db.run(`SELECT id,name,imgurl,year,minplay,maxplay,savegame FROM users u
        JOIN boardgames b on u.userid = b.savegame
        where id = $1 and u.userid = $2`,[req.params.id, req.user.userid],(err, re)=>{
        if (re){
            res.status(200).json(re);
        }
        else res.status(403).send(err)
    })
});

app.get(`/games/rules/:id`, (req,res,next) =>{
    db.run(`Select rulesurl from rules
        where gameid = $1`,[req.params.id],(err,re)=>{
        res.status(200).json(re)
    })
});

app.delete(`/user/savegames/:id`,(req,res,next)=>{
        db.run(`DELETE FROM boardgames 
            where id = $1 and savegame = $2`,[req.params.id, req.user.userid],(err, re)=>{
            if (re) res.status(200).send(`ok`);
            else res.status(403).send(err)
        })

});

app.get(`/games/gamesbyid/:id`,(req,res,next)=>{
    axios.get(`https://www.boardgamegeek.com/xmlapi/boardgame/${req.params.id}`, {
        responseType:`json`}).then(re=>{
        if(re){
            xmlToJSON(re.data, (err, result) =>{
                res.status(200).json(result)
            })
        }else res.status(503).send(`error`)
    });
    }
)
app.get(`/games/gamelist/:search`,(req,res,next)=>{
    axios.get(`https://www.boardgamegeek.com/xmlapi/search?search=${req.params.search}`, {
        responseType:`json`}).then(re=>{
        if(re){
            xmlToJSON(re.data, (err, result) =>{
                res.status(200).json(result)
            })
        }else res.status(503).send(`error`)
})
});

app.get(`/games/gamelist`,(req,res,next)=>{
    axios.get(`https://www.boardgamegeek.com/xmlapi2/hot?boardgame`, {
        responseType:`json`}).then(re=>{
        xmlToJSON(re.data, (err, result) =>{
            res.status(200).json(result)
        })
    })
});

app.post(`/user/reviews`,(req,res,next)=>{
   db.run(`INSERT INTO reviews(username, userid, gameid, review, stars)
    VALUES ($1, $2, $3, $4, $5);`, [req.user.username, req.user.userid,req.body.objectid,req.body.review,req.body.stars],(err, re)=>{
       if(err)res.status(403).send(err)
       else res.status(200).send(`ok`)

   })
});

app.get(`/user/reviews/:id`,(req,res,next)=>{
    db.run(`SELECT username, review, stars FROM reviews
where gameid = $1 `,[req.params.id],(err,re)=>{
        if(err)res.status(403).send(err);
        else res.status(200).json(re);
    })
});


app.get(`/games/gamebyid/review/:id`,(req,res,next)=>{
    axios.get('https://www.googleapis.com/youtube/v3/search', {
        params:{
            key: config.youtubeKey,
            type: 'video',
            maxResults: '1',
            part: 'id,snippet',
            fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken,prevPageToken',
            q: req.params.id
        }}).then(re=>{
    res.status(200).json(re.data.items)
    })
});





app.listen(3001, () =>{
   console.log('Wow Listning on 3001!')
});