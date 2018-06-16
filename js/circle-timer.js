function playSound(soundfile) {
  //put the if condition here
  if(soundfile)$("#tick").html("<embed id='tock' src="+soundfile+" hidden='true' autostart='true' loop='false' />");
}

function CircleTimer(config, cp_config) {
  this.init(config, cp_config);
  $("body").append("<span id='tick'><embed id='tock' src='#' hidden='true' autostart='true' loop='false' /></span>");
}

var canvas, ctx, totalDuration, timerID, tick, buzz, ctxFont;
CircleTimer.prototype = {

  config: null,
  cp_config: null,

  cp_config_defaults: {
    startAngle: 1.5 * Math.PI,
    value: 0
  },

  duration: 60,
  progressInterval: null,
  $target: null,
  timer: null,

  init: function(config, cp_config) {
    this.config = config;
    this.$target = $(config["target"]);

    if ( this.$target.size() == 0 ) { return false; }

    //set timer values
    //totalDuration (number of seconds the timer is set to)
    totalDuration = config["duration"] || 60;
    //tick (played every second)
    tick = config["tick"] || null;
    //buzz (played at last second / end of timer)
    buzz = config["buzz"] || null;
    //timerID (configure timer with ID, so we can fill it with count down text)
    timerID = config["id"] || "circleTimer";
    //fontSize (used to center the count down timer)
    ctxFont = config["fontSize"] || 30;

    // determine how much we need to move the progress meter
    // every time depending on the duration needed
    this.duration = totalDuration;
    this.progressInterval = parseFloat(100 / this.duration / 100).toFixed(3);

    this.cp_config = $.extend({}, this.cp_config_defaults, cp_config);

    // setup the circle progress on the target
    this.$target.circleProgress(this.cp_config);
    this.timer = this.$target.data("circleProgress");

    // configure inner timer counter
    this.$target.children("canvas").attr("id", timerID);
    canvas = document.getElementById(timerID);
    ctx = canvas.getContext("2d");
    // inner counter styling
    ctx.textAlign="center";
    ctx.textBaseline = "middle";
    ctx.font = ctxFont + "px Arial";
  },

  start: function() {
    // set local variables because the setInterval function
    // will execute in the scope of this function
    var timer = this.timer;
    var $target = this.$target;
    var onFinished = this.config["onFinished"];
    var progressInterval = parseFloat(this.progressInterval);
    var flag = false;
    // start the timer
    var timerIntervalId = setInterval(function() {
      // calculate the next progress step
      timer.value = parseFloat(parseFloat(timer.value + progressInterval).toFixed(3));


      // check if the progress is complete (hitting 1 or more means done)
      if ( timer.value >= 1 ) {
        timer.value = 1; // set it to 1 so it looks perfectly complete
        clearInterval(timerIntervalId); // stop the timer
        playSound(buzz);
        // run the onFinished callback if set
        if (typeof(onFinished) == "function") {
          onFinished($target);
        }
      } else if(totalDuration>10) {
        playSound(tick);
      }
      // redraw the circle with the new value
      timer.draw();
      if(totalDuration<=10 && totalDuration > 5) {
        playSound(tick);
      }
      if(totalDuration<=5 && totalDuration > 0) {
        playSound(tick);
        setTimeout(function() { playSound(tick); }, 500);
        ctx.fillStyle = "red";
      }
      ctx.fillText(totalDuration+"s", canvas.width/2, canvas.height/2);
      totalDuration --;
    }, 1000);

    // set the timer interval on the elements data incase someone else
    // wants to stop the timer
    $target.data('timerIntervalId', timerIntervalId);
  },

  stop: function() {
    clearInterval(this.$target.data('timerIntervalId')); // stop the timer
  }

}
