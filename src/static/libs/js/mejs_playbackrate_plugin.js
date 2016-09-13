//Copy this plugin and add 'fasterslower' to the features array. Also write the CSS :)
// Thanks:) https://gist.github.com/rocky-jaiswal/4995622
// 9/8/16 modified fasterslower UI elements

(function($) {

    $.extend(mejs.MepDefaults, {
        fasterslowerText: 'Faster/Slower'
    });

    $.extend(MediaElementPlayer.prototype, {
        speedOptions: [1, 1.25, 1.5, 2, 0.5, 0.75],
        speedOptionsText: ["1X", "1.25X", "1.5X", "2X", "0.5X", "0.75X"],
        speedOptionsIndex: 0,

        buildfasterslower: function(player, controls, layers, media) {
            var t = this;

            var displaySpeed =
                $('<div class="display-playback-speed hidden">1X</div> ')
                    .appendTo(controls)
                    .click(function(e) {
                        t.speedOptionsIndex ++;
                        media.playbackRate = t.speedOptions[t.speedOptionsIndex];
                        displaySpeed.html(t.speedOptionsText[t.speedOptionsIndex]);
                        if (t.speedOptionsIndex === 5) { t.speedOptionsIndex = -1 }
                        return false;
                    });
        }
    });

})(mejs.$);
