cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.accLeft = false;
    this.accRight = false;
    this.originPosX = this.node.x;
    this.originPosY = this.node.y;
  },

  resetState() {
    this.node.x = this.originPosX;
    this.node.y = this.originPosY;
    this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
    this.getComponent(cc.RigidBody).linearDamping = 0;
    this.getComponent(cc.RigidBody).angularDamping = 0;
    this.getComponent(cc.RigidBody).angularVelocity = 0;
  },
  onKeyyDown(key) {
    switch (key) {
      case "a":
        this.node.getComponent(cc.Animation).playAdditive("moveFoward");
        this.accLeft = true;
        break;
      case "d":
        this.node.getComponent(cc.Animation).playAdditive("moveBack");
        this.accRight = true;
        break;
      case "w":
        var animState = this.node
          .getComponent(cc.Animation)
          .getAnimationState("jump");
        if (!animState.isPlaying)
          this.node.getComponent(cc.Animation).playAdditive("jump");
        break;
      case "space":
        var animState = this.node
          .getComponent(cc.Animation)
          .getAnimationState("kick");
        if (!animState.isPlaying)
          this.node.getComponent(cc.Animation).playAdditive("kick");
        break;
    }
  },

  onKeyyUp(key) {
    switch (key) {
      case "a":
        this.accLeft = false;
        // this.node.getComponent(cc.Animation).playAdditive('idle');
        break;
      case "d":
        this.accRight = false;
        // this.node.getComponent(cc.Animation).playAdditive('idle');
        break;
      case "w":
        var animState = this.node
          .getComponent(cc.Animation)
          .getAnimationState("jump");
        if (!animState.isPlaying)
          // this.node.getComponent(cc.Animation).playAdditive('idle');
          break;
      case "space":
        var animState = this.node
          .getComponent(cc.Animation)
          .getAnimationState("kick");
        if (!animState.isPlaying)
          // this.node.getComponent(cc.Animation).playAdditive('idle');
          break;
    }
  },

  update(dt) {
    if (this.accLeft) {
      this.node.x -= 10;
    } else if (this.accRight) {
      this.node.x += 10;
    }
  }
});
