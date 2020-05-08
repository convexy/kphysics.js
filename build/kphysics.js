"use strict";
class KQuaternion {
    constructor(w = 0, x = 0, y = 0, z = 0) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(w, x, y, z) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static multiple(a, kq) {
        return new KQuaternion(a * kq.w, a * kq.x, a * kq.y, a * kq.z);
    }
    static sum(kq1, kq2) {
        return new KQuaternion(kq1.w + kq2.w, kq1.x + kq2.x, kq1.y + kq2.y, kq1.z + kq2.z);
    }
    static difference(kq1, kq2) {
        return new KQuaternion(kq1.w - kq2.w, kq1.x - kq2.x, kq1.y - kq2.y, kq1.z - kq2.z);
    }
}
class KVector {
    constructor(array) {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }
    static multiple(a, v) {
        return new KVector([a * v.x, a * v.y, a * v.z]);
    }
    static sum(v1, v2) {
        return new KVector([v1.x + v2.x, v1.y + v2.y, v1.z + v2.z]);
    }
    static difference(v1, v2) {
        return new KVector([v1.x - v2.x, v1.y - v2.y, v1.z - v2.z]);
    }
    static innerProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
}
const NONE = "";
const SPHERE = "SPHERE";
const RECTANGULAR = "RECTANGULAR";
class KObject {
    constructor(mass) {
        this.mass = mass;
        this.position = new KVector([0, 0, 0]);
        this.velocity = new KVector([0, 0, 0]);
        this.shape = NONE;
    }
    update(dt) {
        this.position.add(KVector.multiple(dt, this.velocity));
    }
}
class KWorld {
    constructor() {
        this.kobjs = [];
    }
    add(kobj) {
        if (!this.kobjs.includes(kobj)) {
            this.kobjs.push(kobj);
        }
    }
    update(dt) {
        this.kobjs.forEach((kobj) => {
            kobj.update(dt);
        });
        for (let i = 0; i < this.kobjs.length; i++) {
            let kobj1 = this.kobjs[i];
            for (let j = 0; j < i; j++) {
                let kobj2 = this.kobjs[j];
                if (DetectCollision(kobj1, kobj2)) {
                    Collision(kobj1, kobj2);
                }
            }
        }
    }
}
class KSphere extends KObject {
    constructor(mass, radius) {
        super(mass);
        this.radius = radius;
        this.shape = SPHERE;
    }
}
class KRectangular extends KObject {
    constructor(mass, width, height, depth) {
        super(mass);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.shape = RECTANGULAR;
    }
}
function DetectCollision(kobj1, kobj2) {
    if (kobj1.shape == SPHERE && kobj2.shape == SPHERE) {
        let ks1 = kobj1;
        let ks2 = kobj2;
        return (KVector.difference(ks1.position, ks2.position).length <=
            ks1.radius + ks2.radius);
    }
    return false;
}
function Collision(kobj1, kobj2) {
    if (kobj1.shape == SPHERE && kobj2.shape == SPHERE) {
        let ks1 = kobj1;
        let ks2 = kobj2;
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
