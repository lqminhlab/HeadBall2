const WebSocket = require('ws')
const uuidv1 = require('uuid/v1');

class PlayerData {
    constructor(id, x) {
        this.id = id;
        this.x = x;
        this.index = 0;
        this.key = '';
        this.idRoom = null;
    }
}

class Room {
    constructor(id) {
        this.id = id;
        this.playerA_Id = null;
        this.playerB_Id = null;
        this.total = 0;
        this.created =  new Date();
    }
}
const KEY_CONNECTED = 'connected';
const KEY_READY = 'ready';
const KEY_INGAME = 'ingame';
// https://www.jianshu.com/p/a391b8452b5a 

const wss = new WebSocket.Server({ port: 8080 })
let users = {};
let listRoom = [];

wss.on('connection', function connection(ws) {
    let player = new PlayerData(uuidv1(), 0);
    player.ws = ws;
    player.key = KEY_CONNECTED;

    if (listRoom.length == 0) {
        var room = new Room(uuidv1())
        room.playerA_Id = player.id;
        room.total = 1;
        player.idRoom = room.id;
        player.index = 1;
        listRoom.push(room);
    } else {
        var addRoom = false;
        for(let room in listRoom) {
            if (listRoom[room].total < 2) {
                listRoom[room].playerB_Id = player.id;
                listRoom[room].total = 2;
                player.idRoom = listRoom[room].id;
                player.index = 2;
                addRoom = true;
                break;
            }
        };

        if (!addRoom) {
            var room = new Room(uuidv1())
            room.playerA_Id = player.id;
            room.total = 1;
            player.idRoom = room.id;
            player.index = 1;
            listRoom.push(room);
        }
    }
    
    users[player.id] = player;

    console.log('--------- LIST ROOM ----------',listRoom);
    
    ws.send(JSON.stringify({
        'id'  : player.id, 
        'x'   : player.x,
        'key' : player.key,
        'idRoom' : player.idRoom,
        'type' : 'ME',
        'index':player.index
    })); 

    console.log('____________________');
    console.log('| client++: ' + player.id + ' connected');
    console.log('| size : ' + Object.keys(users).length);
    // console.log(Object.keys(wss).length);
    console.log('____________________');

    // wss.clients.forEach(function each(client) {
    //     if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         //   client.send(data);
    //         // console.log(client);
    //     }
    // });

    let roomPlayer = listRoom.find(room => room.id === player.idRoom)
    
    if (roomPlayer.total == 2) {
        var playerA_Id = listRoom.find(room => room.id === player.idRoom).playerA_Id
        var playerB_Id = listRoom.find(room => room.id === player.idRoom).playerB_Id
        users[playerA_Id].ws.send(JSON.stringify({
            'id'  : users[playerB_Id].id, 
            'x'   : users[playerB_Id].x,
            'key' : users[playerB_Id].key,
            'type' : 'RIVAL',
            'index': users[playerB_Id].index
        })); 
        users[playerB_Id].ws.send(JSON.stringify({
            'id'  : users[playerA_Id].id, 
            'x'   : users[playerA_Id].x,
            'key' : users[playerA_Id].key,
            'type' : 'RIVAL',
            'index': users[playerA_Id].index
        })); 
    } 

    // for(let user_id in users) {
    //     let user = users[user_id];

    //     // console.log(user_id);
    //     if(user.ws != ws) {
    //         console.log(`rival: ${player.id} vs ${user.id}`); 
    //         user.ws.send(JSON.stringify({
    //             'id'  : player.id, 
    //             'x'   : player.x,
    //             'key' : player.key,
    //             'type' : 'RIVAL',
    //             'index': player.index
    //         })); 
    //         ws.send(JSON.stringify({
    //             'id'  : user.id, 
    //             'x'   : user.x,
    //             'key' : user.key,
    //             'type' : 'RIVAL',
    //             'index': user.index
    //         })); 
    //     }
    // }

    ws.on('message', data => {
        console.log(data);
        
        let playerdata = JSON.parse(data);
        if(playerdata.type == KEY_READY) {
            console.log(`Received message form client: => ${data}`)
        }
        let pack = new Array();
        if(playerdata.type == KEY_INGAME) {
            console.log('sent: ')
            console.log(playerdata);
            var userInRoom = [users[roomPlayer.playerA_Id],users[roomPlayer.playerB_Id]]
            for(let id in userInRoom) {
                let user = userInRoom[id];
                user.type = KEY_INGAME;
                pack.push(playerdata);
            }
            for(let id in userInRoom) {
                userInRoom[id].ws.send(JSON.stringify(
                    pack
                )); 
            }
             
        }
    })
    
    ws.on('close', message => {
        console.log('close .. ');
        console.log(message);
        console.log(wss.clients.length);

        for(let obj in users) {
            console.log(obj);
            if(users[obj].ws == ws) {
                console.log("remove client --");
                delete users[obj];
                break;
            }
        }
        console.log('clients size : ' + Object.keys(users).length);
    });
    
    ws.on('error', function (code, reason) {
        console.log(code);
    });
});

