//Copy this plugin and add 'fasterslower' to the features array. Also write the CSS :)
// Thanks:) https://gist.github.com/rocky-jaiswal/4995622
// 9/8/16 modified fasterslower UI elements

(function($) {

    $.extend(mejs.MepDefaults, {
        fasterslowerText: 'Faster/Slower'
    });

    $.extend(MediaElementPlayer.prototype, {
        buildfasterslower: function(player, controls, layers, media) {
            var t = this;

            var displaySpeed =
                $('<div class="display-playback-speed hidden">Playback Speed: 100%</div> ')
                    .appendTo(controls);

            var faster =
                    $('<div class="mejs-faster-button hidden" >' +
                        '<button type="button" aria-controls="' + t.id + '" title="' + t.options.fasterslowerText + '">+</button>' +
                    '</div>')
                    .appendTo(controls)
                    .click(function(e) {
                        e.preventDefault();
                        media.pause();
                        if(media.playbackRate < 1.75) media.playbackRate = media.playbackRate + 0.25;
                        media.play();
                        displaySpeed.html("Playback Speed: " + media.playbackRate * 100 + "%");
                        return false;
                    });

            var slower =
                    $('<div class="mejs-slower-button hidden" >' +
                        '<button type="button" aria-controls="' + t.id + '" title="' + t.options.fasterslowerText + '">-</button>' +
                        '</div>')
                        .appendTo(controls)
                        .click(function(e) {
                            e.preventDefault();
                            media.pause();
                            if(media.playbackRate > 0.5) media.playbackRate = media.playbackRate - 0.25;
                            media.play();
                            displaySpeed.html("Playback Speed: " + media.playbackRate * 100 + "%");
                            return false;
                        });

            media.addEventListener('play',function() {
                if (media.pluginType === "native"){
                    faster.removeClass('hidden');
                    slower.removeClass('hidden');
                    displaySpeed.removeClass('hidden');
                }
            }, false);

            media.addEventListener('pause',function() {
                if(!faster.hasClass("hidden")){
                    faster.addClass('hidden');
                }
                if(!slower.hasClass("hidden")){
                    slower.addClass('hidden');
                }
                if(!displaySpeed.hasClass("hidden")){
                    displaySpeed.addClass('hidden');
                }
            }, false);
        }
    });

})(mejs.$);
