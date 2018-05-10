# server-project

This app is a server project that I did to update a site called boardgamegeek.com

## Getting Started

### Prerequisites

Must have [Node.js](https://nodejs.org/en/) version 8.4.0=> 


### Installing

Clone the repo

```
git clone https://github.com/bolty2142/server-project.git

```

Run 

```  yarn install  ```

Or 

``` npm install ```

Next you must have a postgresql server running in the background

I will include a sql.init in the future

## Development

Run

``` yarn startDev ```


This will kick off the backend and any changes to the public folder will be updated upon page refresh

To build this you must have gulp installed

``` npm i -g gulp-cli ```

and run 

``` gulp build ```


## Deployment

This app is hosted in a docker container on AWS ECS and it's using a postgres rds

Once pushed to production it will update the task definition and update the service in the production cluster


## Built With

* [Angular.js v1.7](https://angularjs.org/) - The web framework used
* [Express](https://expressjs.com/) - The server framework
* [Node.js](https://nodejs.org/en/) - The backend server
* [Gulp.js](https://gulpjs.com/) - The compiler



## Authors

* **Andrew Langford** - *initial work* - [GitHub Link](https://github.com/alangford)

See also the list of [contributors](https://github.com/alangford/server-project/graphs/contributors) who participated in this project

