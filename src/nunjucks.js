const nunjucks = require('nunjucks'),
      stripTags = require('striptags'),
      he = require('he'),
      _ = require('lodash');

function nunjucksConfig () {

  const app = this;

  var env = nunjucks.configure(__dirname + '/templates', {
    autoescape: true,
    cache: false,
    express: app
  });

  env.addFilter('isPlaylist', function(obj) {
    return typeof obj == 'object';
  });

  env.addFilter('isEpisode', function (obj) {
    if (obj.startTime === 0 && obj.endTime === null) {
      return true;
    } else {
      return false;
    }
  });

  env.addFilter('sortTextIgnoreArticles', function (arr) {

    // Thanks to Spencer Wieczorek
    // http://stackoverflow.com/a/34347138/2608858
    var compare = function(a, b) {
      if (a.title && b.title) {
        var aTitle = a.title.toLowerCase(),
            bTitle = b.title.toLowerCase();

        aTitle = removeArticles(aTitle);
        bTitle = removeArticles(bTitle);

        if (aTitle > bTitle) return 1;
        if (aTitle < bTitle) return -1;
      }
      return 0;
    };

    function removeArticles(str) {
      words = str.split(" ");
      if(words.length <= 1) return str;
      if( words[0] == 'a' || words[0] == 'the' || words[0] == 'an' )
        return words.splice(1).join(" ");
      return str;
    }

    var sorted = arr.sort(compare)

    return sorted;

  });

  env.addFilter('stringify', function(str) {
    var s = JSON.stringify(str);
    return s;
  });

  env.addFilter('readableDate', function(date) {
    if (typeof date === 'string' || typeof date === 'object') {
      // Thanks:) http://stackoverflow.com/questions/19485353/function-to-convert-timestamp-to-human-date-in-javascript
      var dateObj = new Date(date),
          year = dateObj.getFullYear(),
          month = dateObj.getMonth() + 1,
          day = dateObj.getDate();


      // If date is within the past 6 days, then display name of day instead of date
      var date6DaysAgo = new Date().getTime() - (6 * 24 * 60 * 60 * 1000);
      var today = new Date();
      var yesterday = new Date(today);
      yesterday.setDate(today.getDate() -1);

      if (dateObj > date6DaysAgo) {
        if (dateObj.getDay() === today.getDay()) {
          return 'Today';
        } else if (dateObj.getDay() === yesterday.getDay()) {
          return 'Yesterday';
        } else {
          var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          var dayName = days[dateObj.getDay()];
          return dayName
        }
      } else {
        // Else return the date in mm/dd/yyyy format
        return month+'/'+day+'/'+year;
      }
    }
  });

  env.addFilter('nl2br', function(str) {
    if (str) {
      return str.replace(/\r|\n|\r\n/g, '<br />')
    }
  });

  env.addFilter('stripTags', function(str) {
    if (str) {
      return stripTags(str);
    }
  });

  env.addFilter('decodeHTML', function(str) {
    if (str) {
      str = he.decode(str);
    }
    return str;
  });

  env.addFilter('truncString', function(str, limit) {
    let isOverLimit = false;
    if (str.length > limit) {
      isOverLimit = true;
    }

    str = str.substring(0, parseInt(limit));
    str = str.trim();

    if (isOverLimit) {
      str += '...';
    }

    return str;
  });

  // TODO: This identify function is also in the scripts.js. Maybe this should
  // be refactored.
  env.addFilter('convertSecToHHMMSS', function(sec) {
    // thanks to dkreuter http://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
    var totalSec = sec;

    var hours = parseInt(totalSec / 3600) % 24;
    var minutes = parseInt(totalSec / 60) % 60;
    var seconds = totalSec % 60;
    var result = '';

    if (hours > 0) {
      result += hours + ':';
    }

    if (minutes > 9) {
      result += minutes + ':';
    } else if (minutes > 0 && hours > 0) {
      result += '0' + minutes + ':';
    } else if (minutes > 0){
      result += minutes + ':';
    } else if (minutes === 0 && hours > 0) {
      result +=  '00:';
    }

    if (seconds > 9) {
      result += seconds;
    } else if (seconds > 0 && minutes > 0) {
      result += '0' + seconds;
    } else if (seconds > 0) {
      result += seconds;
    } else {
      result += '00';
    }

    if (result.length == 2) {
      result = '0:' + result;
    }

    if (result.length == 1) {
      result = '0:0' + result;
    }

    return result
  });

  // Thanks Wilson Lee http://stackoverflow.com/a/37096512/2608858
  env.addFilter('secondsToReadableDuration', function (sec) {
    sec = Number(sec);
    var h = Math.floor(sec / 3600);
    var m = Math.floor(sec % 3600 / 60);
    var s = Math.floor(sec % 3600 % 60);

    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m > 0 ? m + "m " : "";
    var sDisplay = s > 0 ? s + "s" : "";

    var fullDisplay = hDisplay + mDisplay + sDisplay;

    // Thanks Jon http://stackoverflow.com/a/6253616/2608858
    if (fullDisplay.substr(fullDisplay.length-1) === ' ') {
      fullDisplay = fullDisplay.substr(0, fullDisplay.length-1);
    }

    return fullDisplay;
  });

  env.addFilter('formatCategoriesString', function (categories) {

    // Weird to use a reduce here, since the resulting array may have more items
    // than the one we started with.
    categories = _.reduce(categories, (acc, category) => {
      if (category.indexOf('/') > -1) {
        let stringArray = category.split('/');
        for (str of stringArray) {
          str = str.trim();
          acc.push(str);
        }
      } else {
        acc.push(category);
      }
      return acc;
    }, []);

    categories = _.reduce(categories, (acc, category) => {
      if (category.indexOf('&') > -1) {
        let stringArray = category.split('&');
        for (str of stringArray) {
          str = str.trim();
          acc.push(str);
        }
      } else {
        acc.push(category);
      }
      return acc;
    }, []);

    categories = _.uniq(categories);

    let categoriesString = categories.join();
    categoriesString = categoriesString.replace(/,/g, ', ');

    return categoriesString;
  });

}

module.exports = {nunjucks: nunjucksConfig};
