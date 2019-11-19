import { PlayerData, KEY_CONNECTED, KEY_READY, KEY_INGAME } from './GameDefine';
import PalyerA from './PlayerA';

cc.Class({
    extends: cc.Component,

    ctor: function () {
        this.websocket = null;
        this.isConnected = false;
        this.player = PalyerA;
        this.playerDataMe = null;
        this.playerDataRivel = null;
    },
    properties: {
        prefab_Player: { 
            default: null,
            type: cc.Prefab
        },

        me_Player: { 
            default: null,
            type: cc.Prefab
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.websocket = new WebSocket("ws://127.0.0.1:8080");
        var self = this;
        this.websocket.onopen = function (evt) {
            // cc.log(evt);
            self.isConnected = true;
        };
        // console.log(KEY_CONNECTED);
        // console.log(PalyerA);

        this.websocket.onmessage = function (evt) {
            console.log('data: ' + evt.data);
            let playerdata = JSON.parse(evt.data);
            if(playerdata.key != undefined && playerdata.key == KEY_CONNECTED) {
                if(playerdata.type == 'ME'){
                    self.playerDataMe = playerdata;
                    self.playerDataMe.node = cc.instantiate(self.me_Player);
                    if (self.playerDataMe.index == 2) {
                        self.playerDataMe.node.x = 150;
                        self.playerDataMe.node.scaleX *= -1;
                    } 
                    self.node.addChild(self.playerDataMe.node);
                    console.log("connect succes to server");
                }
                if(playerdata.type == 'RIVAL') {
                    self.playerDataRivel = playerdata;
                    self.playerDataRivel.node = cc.instantiate(self.prefab_Player);
                    // rival.x = -100;

                    
                    if (self.playerDataRivel.index == 2) {
                        self.playerDataRivel.node.x = 150;
                        self.playerDataRivel.node.scaleX *= -1; 
                    }

                    // self.playerDataRivel.node.color = cc.Color.RED;
                    self.node.addChild(self.playerDataRivel.node);
                    console.log(`rival: ${self.playerDataMe.id} vs ${self.playerDataRivel.id}` );
                }
                if(playerdata.type == KEY_INGAME) {
                    console.log(`data rivel: x=${playerdata.x}`);
                    self.playerDataRivel.x = playerdata.x;
                }
            }
            for(let i = 0 ; i < playerdata.length; i ++) {
                if(playerdata[i].id == self.playerDataRivel.id)
                    self.playerDataRivel.node.x = playerdata[i].x;
                    console.log(self.playerDataRivel.node.x);
                    
            }
        };

        this.websocket.onclose = function (event) {
            console.log("Closed ");
            self.isConnected = false;
        }

        // this.player = cc.find('Canvas/player_A').getComponent(PalyerA);
        // // this.Send(this.player.getInfo(KEY_READY));
        // console.log(this.player.node.x);
        
    },

    update (dt) {
        if(this.isConnected == false) 
            return;

        // this.Send('dt: ' + dt);
    },

    Send(data) {
        if(this.websocket != null && this.isConnected == true)
        this.websocket.send(data);
    }
});
