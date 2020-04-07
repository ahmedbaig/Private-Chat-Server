# MEAN MONGODB ACCESSING WITH CORS

This is a boilerplate using the following technologies:
- [Angular](https://angular.io/) for the frontend
- [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend
- [Sass](http://sass-lang.com/) for styles (using the SCSS syntax)
- [Webpack](https://webpack.github.io/) for compilation
- [CORS](https://www.npmjs.com/package/cors) for Cross origin resource sharing


## Requirements

- [Node.js](https://nodejs.org/en/) 10+

```shell
npm install
```


## Connection

Make sure to add in the `server.js` folder with only DB link.
```shell
module.exports = {
    db: 'mongodb://localhost:27017/<address>'
  };
```

