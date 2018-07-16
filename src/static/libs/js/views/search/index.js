require('../../navbar.js');
require('../../auth.js');

import {searchPodcasts} from '../../podcastHelper';

$('#search .search-podcasts-btn').on('click', () => {
  loadSearchResults();
  if (window.searchQuery) {
    window.searchQuery = null;
    history.pushState(null, "", location.href.split("?")[0]);
  }
});

$('#search .search-input').keypress((e) => {
  var key = e.which;
  if (key == 13) { // enter key
    loadSearchResults();
  } 
  if (window.searchQuery) {
    window.searchQuery = null;
    history.pushState(null, "", location.href.split("?")[0]);
  }
});

let isLoading = false;

function loadSearchResults (query) {

  query = query || $('#search input').val();

  if (!query || isLoading) {
    return;
  };  

  $('#search .search-input').prop('disabled', true);
  $('#search .search-podcasts-btn').prop('disabled', true);

  $('.search-results').html('');
  $('.search-results-empty').hide();
  $('.search-results-error').hide();
  $('.search-loader').show();

  searchPodcasts(query)
    .then(results => {
      $('.search-loader').hide();
      $('#search .search-input').prop('disabled', false);
      $('#search .search-podcasts-btn').prop('disabled', false);

      if (!results || results.length === 0) {
        $('.search-results-empty').show();
        return;
      }

      let html = results.length > 0 ? `<div class="search-result-count">${results.length} podcast${results.length > 1 ? 's' : ''} found</div>` : '';

      for (let result of results) {
        html += `<a class="search-result" href="/podcasts/${result.id}">`;
        html +=   `<div class="search-result-image">`;
        html +=     `<img src="${result.imageUrl}" />`
        html +=   `</div>`
        html +=   `<div class="search-result-title">`;
        html +=     `${result.title}`;
        html +=   `</div>`
        html += `</a>`
      }

      $('.search-results').append(html);

      let requestHtml = "<div class='search-results-request'>Not what you're looking for? <a href='https://goo.gl/forms/ai0VN8albaRJ12Ro1'>Request podcast</a></div>";

      $('.search-results').append(requestHtml);
    })
    .catch(err => {
      $('.search-loader').hide();
      $('.search-results-error').show();
      $('#search .search-input').prop('enabled', true);
      $('#search .search-podcasts-btn').prop('enabled', true);
      console.log(err);
    })

}

if (window.searchQuery) {
  $('#search input').val(window.searchQuery);
  loadSearchResults(window.searchQuery);
}