module.exports = (app) => {
    const WSServer = require('express-ws')(app)
    const aWss = WSServer.getWss()
  
    app.ws('/', (ws, req) => {
        ws.on('message', (msg) => {
            msg = JSON.parse(msg)
            switch (msg.method) {
                case "connection":
                    connectionHandler(ws, msg)
                    break
                case "leave":
                    broadcastConnection(ws, msg)
                    break
                case "draw":
                    broadcastConnection(ws, msg)
                    break
            }
        })
        ws.on('close', function() {
            delete(ws);
          });
    })
    
    const connectionHandler = (ws, msg) => {
        ws.id = msg.id
        broadcastConnection(ws, msg)
    }
    
    const broadcastConnection = (ws, msg) => {
        aWss.clients.forEach(client => {
            if(client.id === msg.id){
                client.send(JSON.stringify(msg))
            }
        })
    }

  }