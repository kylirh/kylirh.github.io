// Pomodoro-style timer for jQuery
//
(function($) {

    var secondsRemaining = 0;
    var timerInterval = null;
    
    $.pomodoro = function(minutes) {
        initialize();
        $.pomodoro.start(minutes);
    };

    $.extend($.pomodoro, {
        settings: {
            initialized: false,
            html: '\
            <div id="pomodoro" style="display:none;"> \
              <div class="content"> \
                <span class="timer" id="pomodoro-timer">0:00</span> \
                <ul class="actions"> \
                  <li><a href="" class="cancel-pomodoro">Cancel</a></li> \
                </ul> \
              </div> \
            </div>',
            lengthInMinutes: 25,
            shortBreakInMinutes: 5,
            longBreakInMinutes: 15
        },
    
        start: function(minutes) {
            $(document).trigger('pomodoro.start');
            showPomodoro();
            startTimer(minutes);
            this.running = true;
        },
    
        cancel: function() {
            $(document).trigger('pomodoro.cancel');
            resetPomodoro();
            this.running = false;
        },
        
        finish: function() {
            $(document).trigger('pomodoro.finish');
            resetPomodoro();
            this.running = false;
        },
        
        running: false
    });
    
    function initialize() {
        if($.pomodoro.settings.initialized) return;
        $.pomodoro.settings.initialized = true;
        
        $(document).trigger('pomodoro.initialize');
        
        $('body').append($.pomodoro.settings.html);
        $('.cancel-pomodoro').live('click', function() {
            if ($.pomodoro.running) $.pomodoro.cancel();
            return false;
        });
    }
    
    function startTimer(minutes) {
        secondsRemaining = (minutes || $.pomodoro.settings.lengthInMinutes) * 60;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    function updateTimer() {
        secondsRemaining -= 1;
        
        var minutes = Math.floor(secondsRemaining / 60).toString();
        var seconds = (secondsRemaining % 60).toString();
        
        if(seconds.length == 1) seconds = "0" + seconds;
        
        $('#pomodoro-timer').html(minutes + ":" + seconds);
        
        if(secondsRemaining <= 0) {
            clearInterval(timerInterval);
            $.pomodoro.finish();
            return false;
        }
    }
        
    function showPomodoro() {
        showOverlay();
        $('#pomodoro-timer').html($.pomodoro.settings.lengthInMinutes + ":00");
        $('#pomodoro').css({
            top:	$(window).height() / 2 - ($('#pomodoro').height() / 2),
            left:	$(window).width() / 2 - ($('#pomodoro').width() / 2)
        }).fadeIn(200);
    }
    
    function resetPomodoro() {
        $('#pomodoro').hide();
        hideOverlay();
        secondsRemaining = 0;
        
        if(timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    function showOverlay() {
        if ($('#pomodoro-overlay').length == 0)
          $("body").append('<div id="pomodoro-overlay"></div>');
        $('#pomodoro-overlay').hide().fadeIn(200).click(function() { return false; });
        return false;
    }
    
    function hideOverlay() {
        $('#pomodoro-overlay').fadeOut(200, function(){
          $("#pomodoro-overlay").remove();
        });
        return false;
    }
    
    // getPageScroll() by quirksmode.com
    function getPageScroll() {
        var xScroll, yScroll;
        if (self.pageYOffset) {
            yScroll = self.pageYOffset;
            xScroll = self.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
            yScroll = document.documentElement.scrollTop;
            xScroll = document.documentElement.scrollLeft;
        } else if (document.body) {// all other Explorers
            yScroll = document.body.scrollTop;
            xScroll = document.body.scrollLeft;	
        }
        return new Array(xScroll,yScroll) ;
    }

    // Adapted from getPageSize() by quirksmode.com
    function getPageHeight() {
        var windowHeight;
        if (self.innerHeight) {	// all except Explorer
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
            windowHeight = document.body.clientHeight;
        }	
        return windowHeight;
    }

    $(document).bind('pomodoro.initialize', function() {
        console.log("Initialized pomodoro");
    });

    $(document).bind('pomodoro.start', function() {
        console.log("Started pomodoro");
    });

    $(document).bind('pomodoro.cancel', function() {
        console.log("Cancelled pomodoro");
    });
    
    $(document).bind('pomodoro.finish', function() {
        console.log("Finished pomodoro");
    });
  
})(jQuery);
