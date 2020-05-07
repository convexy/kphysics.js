class KVector {
  x: number;
  y: number;
  z: number;
  constructor(array: number[]) {
    this.x = array[0];
    this.y = array[1];
    this.z = array[2];
  }
  add(v: KVector): KVector {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  get length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
  static multiple(a: number, v: KVector): KVector {
    return new KVector([a * v.x, a * v.y, a * v.z]);
  }
  static sum(v1: KVector, v2: KVector): KVector {
    return new KVector([v1.x + v2.x, v1.y + v2.y, v1.z + v2.z]);
  }
  static difference(v1: KVector, v2: KVector): KVector {
    return new KVector([v1.x - v2.x, v1.y - v2.y, v1.z - v2.z]);
  }
  static innerProduct(v1: KVector, v2: KVector): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }
}

const NONE = "";
const SPHERE = "SPHERE";
type Shape = typeof NONE | typeof SPHERE;

class KObject {
  mass: number;
  position: KVector;
  velocity: KVector;
  shape: Shape;
  constructor(mass: number) {
    this.mass = mass;
    this.position = new KVector([0, 0, 0]);
    this.velocity = new KVector([0, 0, 0]);
    this.shape = NONE;
  }
  update(dt: number): void {
    this.position.add(KVector.multiple(dt, this.velocity));
  }
}

class KWorld {
  kobjs: Array<KObject>;
  constructor() {
    this.kobjs = [];
  }
  add(kobj: KObject) {
    if (!this.kobjs.includes(kobj)) {
      this.kobjs.push(kobj);
    }
  }
  update(dt: number): void {
    this.kobjs.forEach((kobj) => {
      kobj.update(dt);
    });
    for (let i: number = 0; i < this.kobjs.length; i++) {
      let kobj1: KObject = this.kobjs[i];
      for (let j: number = 0; j < i; j++) {
        let kobj2: KObject = this.kobjs[j];
        if (DetectCollision(kobj1, kobj2)) {
          Collision(kobj1, kobj2);
        }
      }
    }
  }
}

class KSphere extends KObject {
  radius: number;
  constructor(mass: number, radius: number) {
    super(mass);
    this.radius = radius;
    this.shape = SPHERE;
  }
}

function DetectCollision(kobj1: KObject, kobj2: KObject): boolean {
  if (kobj1.shape == SPHERE && kobj2.shape == SPHERE) {
    let ks1 = kobj1 as KSphere;
    let ks2 = kobj2 as KSphere;
    return (
      KVector.difference(ks1.position, ks2.position).length <=
      ks1.radius + ks2.radius
    );
  }
  return false;
}

function Collision(kobj1: KObject, kobj2: KObject): void {
  if (kobj1.shape == SPHERE && kobj2.shape == SPHERE) {
    let ks1 = kobj1 as KSphere;
    let ks2 = kobj2 as KSphere;
    let dif = KVector.difference(ks1.position, ks2.position);
    let l = ks1.radius + ks2.radius - dif.length;
    let u = KVector.multiple(1 / dif.length, dif);
    let d1 = ks1.mass * Math.abs(KVector.innerProduct(u, ks1.velocity));
    let d2 = ks2.mass * Math.abs(KVector.innerProduct(u, ks2.velocity));
    let d = d1 + d2;
    ks1.position.add(KVector.multiple(d1 / d, u));
    ks2.position.add(KVector.multiple(-d2 / d, u));
    let v = KVector.difference(ks1.velocity, ks2.velocity);
    let u1 = KVector.multiple(-1 * KVector.innerProduct(u, v), u);
    ks1.velocity.add(u1);
    let u2 = KVector.multiple(KVector.innerProduct(u, v), u);
    ks2.velocity.add(u2);
  }
}
