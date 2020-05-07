window.addEventListener("load", function () {
  let body = document.body;
  let display = window.document.getElementById("main");
  display.setAttribute("width", 100);
  display.setAttribute("height", 100);
  display.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  display.innerHTML =
    '<rect x="0" y="0" width="100" height="100" fill="#ddd" />';

  let point = {
    p: new KSphere(3, 3),
    d: (() => {
      let d = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      d.setAttribute("r", 3);
      d.setAttribute("fill", "orange");
      display.appendChild(d);
      return d;
    })(),
    synchronize() {
      this.d.setAttribute("cx", this.p.position.x);
      this.d.setAttribute("cy", this.p.position.y);
    },
  };

  let point2 = {
    p: new KSphere(3, 3),
    d: (() => {
      let d = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      d.setAttribute("r", 3);
      d.setAttribute("fill", "orange");
      display.appendChild(d);
      return d;
    })(),
    synchronize() {
      this.d.setAttribute("cx", this.p.position.x);
      this.d.setAttribute("cy", this.p.position.y);
    },
  };
  point.p.position.x = 10;
  point.p.position.y = 10;
  point.p.velocity.x = 20;
  point.p.velocity.y = 20;
  point2.p.position.x = 90;
  point2.p.position.y = 10;
  point2.p.velocity.x = -20;
  point2.p.velocity.y = 20;
  point.synchronize();
  point2.synchronize();

  let kworld = new KWorld();
  kworld.add(point.p);
  kworld.add(point2.p);

  let last = performance.now();

  requestAnimationFrame(tick);

  function tick(now) {
    requestAnimationFrame(tick);
    let dt = now - last;
    last = now;
    kworld.update(dt / 1000);
    point.synchronize();
    point2.synchronize();
  }
});
