'use strict'

// Dan Carlin Hardcore History - RSS Feed - http://feeds.feedburner.com/dancarlin/history?format=xml

var dchhEpisode = 'http://traffic.libsyn.com/dancarlinhh/dchha56_Kings_of_Kings.mp3';
var freshAirEpisode = 'http://play.podtrac.com/npr-381444908/npr.mc.tritondigital.com/NPR_381444908/media/anon.npr-podcasts/podcast/381444908/461727430/npr_461727430.mp3?orgId=1&d=2943&p=381444908&story=461727430&t=podcast&e=461727430&ft=pod&f=381444908';
var waitwaitEpisode = 'http://play.podtrac.com/npr-344098539/npr.mc.tritondigital.com/WAITWAIT_PODCAST/media/anon.npr-podcasts/podcast/344098539/459504287/npr_459504287.mp3?orgId=1&d=2995&p=344098539&story=459504287&t=podcast&e=459504287&ft=pod&f=344098539';
var jreEpisode = 'http://traffic.libsyn.com/joeroganexp/p564.mp3';
var dtfhEpisode = 'http://traffic.libsyn.com/lavenderhour/DTFH_178_zach_leary.mp3';

var audio = document.createElement('audio');
audio.setAttribute('controls', '');
audio.setAttribute('preload', 'metadata');
audio.setAttribute('id', 'open-player');

var source = document.createElement('source');
source.setAttribute('src', '');
audio.appendChild(source);

var playerContainer = document.getElementById('player-container');
playerContainer.appendChild(audio);

// audio.load();
// audio.onloadedmetadata = function() {
//     audio.play();
// };
