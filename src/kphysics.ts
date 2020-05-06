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

class KObject {
  mass: number;
  position: KVector;
  velocity: KVector;
  constructor(mass: number) {
    this.mass = mass;
    this.position = new KVector([0, 0, 0]);
    this.velocity = new KVector([0, 0, 0]);
  }
  update(dt: number): void {
    this.position.add(KVector.multiple(dt, this.velocity));
  }
}

class KSphere extends KObject {
  radius: number;
  constructor(mass: number, radius: number) {
    super(mass);
    this.radius = radius;
  }
}

function DetectCollision(s1: KSphere, s2: KSphere): boolean {
  return (
    KVector.difference(s1.position, s2.position).length <= s1.radius + s2.radius
  );
}

function Collision(s1: KSphere, s2: KSphere): void {
  let dif = KVector.difference(s1.position, s2.position);
  let l = s1.radius + s2.radius - dif.length;
  let u = KVector.multiple(1 / dif.length, dif);
  let d1 = s1.mass * Math.abs(KVector.innerProduct(u, s1.velocity));
  let d2 = s2.mass * Math.abs(KVector.innerProduct(u, s2.velocity));
  let d = d1 + d2;
  s1.position.add(KVector.multiple(d1 / d, u));
  s2.position.add(KVector.multiple(-d2 / d, u));
  let v = KVector.difference(s1.velocity, s2.velocity);
  let u1 = KVector.multiple(-1 * KVector.innerProduct(u, v), u);
  s1.velocity.add(u1);
  let u2 = KVector.multiple(KVector.innerProduct(u, v), u);
  s2.velocity.add(u2);
}
