/* eslint-disable */
import {isMobile} from 'react-device-detect';

window.human = false;

let canvasEl;
let ctx;
let numberOfParticules;
let pointerX;
let pointerY;
let tap;
let colors;

export function updateCoords(e) {
  pointerX = e.clientX || e.touches[0].clientX;
  pointerY = e.clientY || e.touches[0].clientY;
}

function setParticuleDirection(p) {
  const minRadius = Math.min(window.innerHeight, window.innerWidth);
  const angle = anime.random(0, 360) * Math.PI / 180;
  const value = anime.random(minRadius/15, minRadius/50);
  const radius = [-1, 1][anime.random(0, 1)] * value;
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle),
  };
}

function createParticule(x, y) {
  const minRadius = Math.min(window.innerHeight, window.innerWidth);
  const p = {};
  p.x = x;
  p.y = y;
  p.color = colors[anime.random(0, colors.length - 1)];
  p.radius = anime.random(minRadius/15, minRadius/50);
  p.endPos = setParticuleDirection(p);
  p.draw = function() {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = p.color;
    ctx.fill();
  };
  return p;
}

function createCircle(x, y) {
  const p = {};
  p.x = x;
  p.y = y;
  p.color = '#FFF';
  p.radius = 0.1;
  p.alpha = .5;
  p.lineWidth = 6;
  p.draw = function() {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.lineWidth = p.lineWidth;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  return p;
}

function renderParticule(anim) {
  for (let i = 0; i < anim.animatables.length; i++) {
    anim.animatables[i].target.draw();
  }
}

export function animateParticules(x, y) {
  const circle = createCircle(x, y);
  const particules = [];
  for (let i = 0; i < numberOfParticules; i++) {
    particules.push(createParticule(x, y));
  }
  anime.timeline().add({
    targets: particules,
    x: function(p) {
      return p.endPos.x;
    },
    y: function(p) {
      return p.endPos.y;
    },
    radius: 0.1,
    duration: 1000,
    easing: 'easeOutExpo',
    update: renderParticule,
  })
    // .add({
    //   targets: circle,
    //   radius: anime.random(80, 160),
    //   lineWidth: 0,
    //   alpha: {
    //     value: 0,
    //     easing: 'linear',
    //     duration: 1000,
    //   },
    //   duration: anime.random(1200, 1800),
    //   easing: 'easeOutExpo',
    //   update: renderParticule,
    //   offset: 0,
    // });
}

const render = anime({
  duration: Infinity,
  update: function() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  },
});

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

export function autoClick() {
  if (window.human) return;
  animateParticules(
      anime.random(centerX-50, centerX+50),
      anime.random(centerY-50, centerY+50),
  );
  anime({duration: 200}).finished.then(autoClick);
}

export default function main() {
  document.getElementById('visualEffectsCanvas');
  canvasEl = document.querySelector('#visualEffectsCanvas');
  ctx = canvasEl.getContext('2d');
  numberOfParticules = 30;
  pointerX = 0;
  pointerY = 0;
  tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
  colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
  document.addEventListener(tap, function(e) {
    window.human = true;
    render.play();
    updateCoords(e);
    animateParticules(pointerX, pointerY);
  }, false);
}
