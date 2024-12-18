(function() {
  'use strict';

  /// Rainbow trail behind name

  var sydney = document.getElementsByClassName('sydney')[0];

  var colors = ['#2ecc71', '#27ae60', // Green
                '#1abc9c', '#16a085', // Turquoise
                '#3498db', '#2980b9', // Blue
                '#9b59b6', '#8e44ad', // Purple
                '#e74c3c', '#c0392b', // Red
                '#e67e22', '#d35400', // Orange
                '#f1c40f', '#f39c12'];// Yellow

  var textShadow = function(x, y, color) {
    x *= 0.0078125; /// 1 / 128 = 0.0078125
    y *= -0.0078125; /// So shadow depends on font-size

    return x + 'em ' + y + 'em ' + color;
  };

  var mod = function(n, m) {
    return ((n % m) + m) % m;
  };

  var shadowTrail = function(colors, startIndex) {
    var textShadows = '';

    for(var i = 0; i < colors.length; i++) {
      var color = colors[mod((i + startIndex), colors.length)];
      var pos = i * 4;

      textShadows += textShadow(pos + 2, pos + 2, color);
      textShadows += ', ';
      textShadows += textShadow(pos + 4, pos + 4, color);
      textShadows += ', ';
    }

    return textShadows.slice(0, -2);
  };

  var index = 0;

  var animate = function() {
    setTimeout(function() {
      requestAnimationFrame(animate);
    }, 50);

    sydney.style.textShadow = shadowTrail(colors, index);

    index--;
  };

  requestAnimationFrame(animate);


  // Rainbow trail behind cursor
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.insertBefore(canvas, document.body.firstChild);

  ctx.globalCompositeOperation = 'screen';

  // Standard Normal variate using Box-Muller transform.
  var randomNormal = function() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  var createParticle = function(x, y) {
    return {
      x:      x + Math.floor(25 * randomNormal()),
      y:      y + Math.floor(25 * randomNormal()),
      width:  Math.floor(20 * Math.random()) + 10,
      height: Math.floor(20 * Math.random()) + 10,
      opacity: 0.5,
      color:  colors[2 * Math.floor(colors.length * Math.random() / 2)]
    };
  };

  var particles = [];

  var animateParticles = function() {
    requestAnimationFrame(animateParticles);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < particles.length; i++) {
      var particle = particles[i];

      particle.opacity -= 0.01;

      if(particle.opacity > 0) {
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.width, particle.height);
      }
      else {
        particles.splice(i, 1);
      }
    }
  };

  var addParticle = function(x, y) {
    particles.push(createParticle(x, y));
  };

  window.addEventListener('mousemove', function(e) {
    addParticle(e.clientX, e.clientY);
  }, false);

  window.addEventListener('touchmove', function(e) {
    var touches = e.touches;

    for(var i = 0; i < touches.length; i++) {
      var touch = e.touches[i];
      addParticle(touch.clientX, touch.clientY);
    }
  }, false);

  requestAnimationFrame(animateParticles);
}).call(this);
