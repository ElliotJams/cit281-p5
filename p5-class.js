//generates a random number between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

class player {
  constructor(type, wpn, hp, name = "Petey") {
    this.type = parseInt(type);
    this.wpn = parseInt(wpn);
    this.hp = parseInt(hp);
    this.name = name;
    this.isImpervious = false;
    this.action = "";
    this.target = 0;
  }
  damage(dmg) {
    this.hp = this.hp - parseInt(dmg);
    return this.hp;
  } 
  attack() {
    return getRandomInt(-5, 5) + this.wpn;
  }
  defend() {
    this.isImpervious = true;
  }
  setAction(action, target) {
    this.action = action;
    this.target = target;
  }
}

class goblin {
  constructor(id, type, wpn, hp, name) {
    this.id = parseInt(id);
    this.type = parseInt(type);
    this.wpn = parseInt(wpn);
    this.hp = parseInt(hp);
    this.name = name;
  }
  damage(dmg) {
    this.hp -= parseInt(dmg);
    return this.hp;
  } 
  attack() {
    return getRandomInt(-3, 3) + this.wpn;
  }
}

class encounter {
  constructor(id) {
    this.id = id;
    this._goblins = [];
  }

  addGoblin(goblin) {
    this._goblins.push(goblin);
  }

  createGoblins(num) {
    for(let i=0; i<num; i++){
      const id = this._goblins.length;
      const type = getRandomInt(1, 3);
      const wpn = getRandomInt(1, 5);
      const hp = getRandomInt(5, 15);
      let name;
      switch(getRandomInt(0, 4)) {
        case 0:
          name = "Greg";
          break;
        case 1:
          name = "Gwyneth";
          break;
        case 2:
          name = "Gianni";
          break;
        case 3:
          name = "Giulia";
          break;
        case 4:
          name = "Grandma";
      }
      const gob = new goblin(id, type, wpn, hp, name);
      this.addGoblin(gob);
    }
  }

  removeGoblin(id) {
    this._goblins = this._goblins.filter(goblin => goblin.id !== id);
    for(let i=0; i<this._goblins.length; i++) {
      this._goblins[i].id = i;
    }
  }

  checkGoblins() {
    let deadGoblins = [];
    for(let gob of this._goblins) {
      if(gob.hp <= 0) {
        this.removeGoblin(gob.id);
        deadGoblins.push(gob);
      }
    }
    return deadGoblins;
  }

  getAttacks() {
    const atks = [];
   for(let gob of this._goblins) {
    atks.push(gob.attack());
   }
   return atks; 
  }
}

module.exports = {
  player,
  goblin,
  encounter,
  getRandomInt,
}

/* const encounter1 = new encounter();
encounter1.createGoblins(3);
console.log(encounter1._goblins); */