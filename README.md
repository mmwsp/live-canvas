# Live canvas
Web application for drawing online based on Websocket protocol. It allows your drawing with other people on the same canvas in real time. 
You need just share generated session link after loggin in.

## Technology used
-ReactJS
-NodeJs
-Express

## Installation

### Clone repo

```
$ git clone https://github.com/mmwsp/live-canvas.git
$ cd LiveCanvas
```

### Setup and run BackEnd
```
$ cd server
$ npm install
$ npm run dev
```

Then you need to set the value of the environment variable `REACT_APP_ADRESS` in the .env file.

### Setup and run FrontEnd
```
$ cd client
$ npm install
$ npm start
```



*Have fun*
