class Mass {
    constructor(m, r, pos, vel) {
        this.mass = m;
        this.pos = pos;
        this.vel = vel;
        this.acc = createVector(0, 0);
        this.radius = r;
        this.c = color(Math.floor(Math.random() * 256),
                    Math.floor(Math.random() * 256),
                    Math.floor(Math.random() * 256));
    }

    applyForce(force) {
        this.acc.add(p5.Vector.div(force, this.mass * 1e-9));
    }

    update() {
        this.vel.add(p5.Vector.mult(this.acc, Math.pow(10, -4)));
        this.pos.add(p5.Vector.mult(this.vel, Math.pow(10, -4)));
        this.acc.set(0, 0);
    }

    show() {
        stroke(255);
        strokeWeight(2);
        fill(this.c);
        ellipse(this.pos.x, this.pos.y, this.radius * 2);
    }
}