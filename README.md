# Live canvas
Web application for real-time drawing based on Websocket protocol. It allows your drawing with other people on the same canvas in real time. 
You need just share generated session link after loggin in.

Demo: https://tranquil-malasada-f247cb.netlify.app/

## Technology used
- ReactJs
- NodeJs
- ExpressJs

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
$ npm start
```

### Setup and run FrontEnd
Then you need to set the value of the environment variable `REACT_APP_ADRESS` in the .env file.
```
$ cd client
$ npm install
$ npm start
```

![Alt text](https://github.com/mmwsp/live-canvas/blob/master/screenshots/scr1.png)

![Alt text](https://github.com/mmwsp/live-canvas/blob/master/screenshots/scr2.png)

![Alt text](https://github.com/mmwsp/live-canvas/blob/master/screenshots/scr3.png)

![Alt text](https://github.com/mmwsp/live-canvas/blob/master/screenshots/last.png)

