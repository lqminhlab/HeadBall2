
 var PlayerData = cc.Class({
    name: "PlayerData",
    properties: {
        id : {
            default: '',
            type: cc.string
        },
        x : {
            default: 0,
            type: cc.Float
        },
        key : {
            default: '',
            type: cc.string
        },
        type : {
            default: '',
            type: cc.string
        },
        node : {
            default : null,
            type: cc.Node

        },
    },
});

var WebSocketPack = cc.Class({
    name: "WebSocketPack",
    properties: {
        key :  {
            default: '',
            type: cc.string
        },
        data : {
            default : null,
            type: PlayerData
        },
    },
})

const KEY_CONNECTED = 'connected';
const KEY_READY = 'ready';
const KEY_INGAME = 'ingame';

module.exports = {
    PlayerData,
    WebSocketPack,
    KEY_CONNECTED,
    KEY_READY,
    KEY_INGAME
}
