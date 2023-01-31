module.exports = (app) => {
    const WSServer = require('express-ws')(app)
    const aWss = WSServer.getWss()
    let users = {}


    app.ws('/', (ws, req) => {
        ws.on('message', (msg) => {
            msg = JSON.parse(msg)
            switch (msg.method) {
                case "connection":
                    connectionHandler(ws, msg)
                    break
                case "leave":
                    leaveHandler(ws, msg)
                    break
                case "draw":
                    broadcastConnection(ws, msg)
                    break
                case "set-background":
                    broadcastConnection(ws, msg)
                    break
            }
        })
      /*  ws.on('close', function() {
            delete users[ws.id]
            delete(ws)
          }); */
    })
    
    const connectionHandler = (ws, msg) => {
        ws.id = msg.id
        if (!users[msg.id]) {
            users[msg.id] = 0
        }
        users[msg.id] += 1
        broadcastConnection(ws, msg)
    }
    
    const leaveHandler = (ws, msg) => {
        ws.id = msg.id
        if(users[msg.id]) {
            users[msg.id] -= 1
            if (users[msg.id] === 0) {
                delete users[msg.id]
            }
            else {
                broadcastConnection(ws, msg)
            }
        }
    }

  /*  const closeHandler = (ws) => {
        if(users[ws.id]) {
            users[ws.id] -= 1
            if (users[ws.id] === 0) {
                delete users[ws.id]
            }
        }
    }*/

    const broadcastConnection = (ws, msg) => {
        aWss.clients.forEach(client => {
            let message = { ...msg }
            if(client.id === msg.id){
                if (msg.method === 'leave' || msg.method === 'connection') {
                    if(users[msg.id]) {
                        message.users = users[msg.id];
                    }
                }
                client.send(JSON.stringify(message))
            }
        })
    }
 
}