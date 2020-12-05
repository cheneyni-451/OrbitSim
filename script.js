const GRAV_CONST = 6.67 * Math.pow(10, -11);

// Solar System Constants

// Sun
const SUN_MASS = 1.989e30;
let SUN_POS;

// Mercury
const MERCURY_MASS = 0.33e24;
const MERCURY_MAX_VEL = 58.98e3;
const MERCURY_MIN_DIS = 46 // 10^9 m

// Venus
const VENUS_MASS = 4.87e24;
const VENUS_MAX_VEL = 35.26e3;
const VENUS_MIN_DIS = 107.48;

// Earth
const EARTH_MASS = 5.97e24;
const EARTH_MAX_VEL = 30.29e3;
const EARTH_MIN_DIS = 147.1;

// Mars
const MARS_MASS = 0.642e24;
const MARS_MAX_VEL = 26.50e3;
const MARS_MIN_DIS = 206.6;

// Jupiter
const JUPITER_MASS = 1898e24;
const JUPITER_MAX_VEL = 13.72e3;
const JUPITER_MIN_DIS = 740.5;

// Saturn
const SATURN_MASS = 568e24;
const SATURN_MAX_VEL = 10.18e3;
const SATURN_MIN_DIS = 1352.6;

// Uranus
const URANUS_MASS = 86.8e24;
const URANUS_MAX_VEL = 7.11e3;
const URANUS_MIN_DIS = 2741.3;

// Neptune
const NEPTUNE_MASS = 102E24;
const NEPTUNE_MAX_VEL = 5.50e3;
const NEPTUNE_MIN_DIS = 4444.5;

// draw an arrow for a vector at a given base position
/**
 * Draws an arrow from base in the direction and magnitude of vec
 * @param {p5.Vector} base the base of the arrow
 * @param {p5.Vector} vec the vector to be made into an arrow
 * @param {color} myColor the color of the arrow
 */
function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}

/**
 * Finds the complement of the input
 * @param {color} c a color
 * @returns {color} the complement of `c`
 */
function comp_color(c) {
    let r = 255 - red(c);
    let g = 255 - green(c);
    let b = 255 - blue(c);
    return color(r, g, b);
}

/**
 * Randomly generates a position and velocity
 * @param {Number} dis the distance from the planet to the sun
 * @param {Number} vel the orbital velocity of the planet
 * @returns {[p5.Vector, p5.Vector]} an two element array with the position and velocity in the respective order
 */
function rand_initial(dis, vel) {
    let rand_vec = p5.Vector.random2D();
    let rand_pos = rand_vec.copy().setMag(dis).add(SUN_POS);
    let rand_vel = rand_vec.copy().setMag(vel).rotate(radians(90));

    return [rand_pos, rand_vel];
}

/**
 * Calculates the gravitational force between two masses
 * @param {Mass} m1 the first Mass
 * @param {Mass} m2 the second Mass
 * @returns {p5.Vector} the gravitational force acting on `m1` from `m2`
 */
function calc_grav_force(m1, m2) {
    let dis = p5.Vector.sub(m2.pos, m1.pos).mult(Math.pow(10, 9));
    let f = dis.setMag(GRAV_CONST * m1.mass * m2.mass / dis.magSq());
    return f;
}

function setup() {
    var x = 3000;
    var y = 3000;
    SUN_POS = createVector(x, y);
    frameRate(60);
    var cnv = createCanvas(6000, 6000);
    background(0, 0, 0);
    mercury_initial = rand_initial(MERCURY_MIN_DIS, MERCURY_MAX_VEL);
    venus_initial = rand_initial(VENUS_MIN_DIS, VENUS_MAX_VEL);
    earth_initial = rand_initial(EARTH_MIN_DIS, EARTH_MAX_VEL);
    mars_initial = rand_initial(MARS_MIN_DIS, MARS_MAX_VEL);
    jupiter_initial = rand_initial(JUPITER_MIN_DIS, JUPITER_MAX_VEL);
    saturn_initial = rand_initial(SATURN_MIN_DIS, SATURN_MAX_VEL);
    uranus_initial = rand_initial(URANUS_MIN_DIS, URANUS_MAX_VEL);
    neptune_initial = rand_initial(NEPTUNE_MIN_DIS, NEPTUNE_MAX_VEL);
    obj_arr = [
        new Mass(MERCURY_MASS, 2, mercury_initial[0], mercury_initial[1]),
        new Mass(VENUS_MASS, 2, venus_initial[0], venus_initial[1]),
        new Mass(EARTH_MASS, 2, earth_initial[0], earth_initial[1]),
        new Mass(MARS_MASS, 2, mars_initial[0], mars_initial[1]),
        new Mass(JUPITER_MASS, 15, jupiter_initial[0], jupiter_initial[1]),
        new Mass(SATURN_MASS, 13, saturn_initial[0], saturn_initial[1]),
        new Mass(URANUS_MASS, 11, uranus_initial[0], uranus_initial[1]),
        new Mass(NEPTUNE_MASS, 11, neptune_initial[0], neptune_initial[1]),
        new Mass(SUN_MASS, 30, SUN_POS, createVector(0, 0))
    ];
}

function draw() {
    clear();
    background(0, 0, 0);
    let max_acc = p5.Vector.mag(obj_arr[0].acc);
    for (var i = 1; i < obj_arr.length; ++i) {
        if (p5.Vector.mag(obj_arr[i].acc) > max_acc) {
            max_acc = p5.Vector.mag(obj_arr[i].acc);
        }
    }
    for (var i = 0; i < obj_arr.length; ++i) {
        let cur_obj = obj_arr[i];
        let obj_acc = cur_obj.acc.copy();
        cur_obj.update();
        cur_obj.show();
        //drawArrow(cur_obj.pos, p5.Vector.div(obj_acc, 1), cur_obj.c);  // Acceleration vector
        //drawArrow(cur_obj.pos, cur_obj.vel, comp_color(cur_obj.c));  // Velocity vector
    }
    for (var i = 0; i < obj_arr.length; ++i) {
        let cur_obj = obj_arr[i];

        for (var j = 0; j < obj_arr.length; ++j) {
            if (j != i) {
                let f = calc_grav_force(cur_obj, obj_arr[j]);
                cur_obj.applyForce(f);
            }
        }
    }
}