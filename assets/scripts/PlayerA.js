import { PlayerData, KEY_INGAME } from './GameDefine';

cc.Class({
    extends: cc.Component,

    properties: {
        accel: 0,
        maxMoveSpeed: 0,
        shoe: {
            default: null,
            type: cc.Node
        },
        btn_left:{
            default:null,
            type:cc.Node
        },
        btn_right:{
            default:null,
            type:cc.Node
        },
        btn_up:{
            default:null,
            type:cc.Node
        },
        btn_kick:{
            default:null,
            type:cc.Node
        }
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accKick = false;

        this.speed = 150;
        this.gravity = -12;
        this.dir = 0 ;
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start () {
        cc.log("PlayerControl start");
        this.playerData = new PlayerData();
        this.playerData.x = this.node.x;

        this.websocketCtr = cc.find('Canvas/GameWorld')
        .getComponent("WebsocketControl");
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.actionShoeRunLeft()
                this.accLeft = true;
                this.dir = -1;
                break;
            case cc.macro.KEY.right:
                this.actionShoeRunRight();
                this.accRight = true;
                this.dir = 1;
                break;
            case cc.macro.KEY.up:
                this.accUp = true;
                break;
            case cc.macro.KEY.d:
                this.accKick = true;
                break;
        }

        
    },

    onKeyUp (event) {
        this.actionStand();
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accKick = false;
        this.dir = 0;
    },

    actionShoeRunRight(){
        if (this.shoe.angle === 42) {
            this.shoe.runAction(cc.rotateBy(0.19, 20));
        }
    },
    actionShoeRunLeft(){
        if (this.shoe.angle === 22) {
            this.shoe.runAction(cc.rotateBy(0.19, -30));
        }
        if (this.shoe.angle === 42) {
            this.shoe.runAction(cc.rotateBy(0.19, -10));
        }
    },
    actionStand(){
        if (this.shoe.angle === 22) {
            this.shoe.runAction(cc.rotateBy(0.19, -20));
        }
        if (this.shoe.angle === 52) {
            this.shoe.runAction(cc.rotateBy(0.19, 10));
        }
    },
    actionKick() {
        cc.tween( this.shoe)
        .to(0.05, { angle: -30 })
        .to(0.05, { angle: 30 })
        .start()
    },

    setJumpAction: function() {
        var jumpUp = cc.moveBy(0.19, cc.v2(0, 20)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(0.19, cc.v2(0, -20)).easing(cc.easeCubicActionIn());
        return this.node.runAction(cc.sequence(jumpUp, jumpDown));
    },

    getInfo(type) {
        this.playerData.x = this.node.x;
        if(this.websocketCtr != null) {
            this.playerData.id = this.websocketCtr.playerDataMe.id;
        }
        
        this.playerData.type = type;
        return JSON.stringify(this.playerData);
    },


    
    update: function (dt) {
        
        if(this.dir == 0) 
            return;

        this.speed -= this.gravity * dt;
        this.node.x += this.speed * this.dir * dt;
        this.playerData.x = this.node.x;

        if (this.accUp){
            this.setJumpAction();
        } else if (this.accKick) {
            this.actionKick();
        }

        if(this.websocketCtr != null) {
            this.websocketCtr.Send(this.getInfo(KEY_INGAME));
        }
    },
});
