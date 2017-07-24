var isSearching = false;

function search(searchText, callback, page = null) {
  var param = {};
  if (page) {
    param.page = page;
  }

  if (isSearching) {
    alert('검색중입니다');
    return;
  }

  isSearching = true;
  $('#loader').show();

  $.ajax({
    url: '/music/search/'+searchText,
    data: param,
    success: callback,
    error: function(err) {
      alert(err.responseText);
    },
    finish: function() {
      isSearching = false;
      $('#loader').hide();
    }
  });
}

$(function(){
  $('#searchOpen').click(function(){
    $('#searchLayout').show();
  });
  $('#close').click(function() {
    $('#searchLayout').hide();
  });
  $('form#searchWrapper').submit(function() {
    $('#searchBtn').click(function() {
      var searchText = $('#searchText').val();
      if (!searchText) {
        alert('검색어를 입력 해 주세요');
        return;
      }

      search(searchText, function(response) {
        var searchResult = $('#searchResult');
        searchResult.empty();
        response.videos.map(function(video) {
          var thumbnailUrl = video.thumbnails.medium.url;
          var li = '<li data-id="'+video.id+'">'
            + '<div class="thumbnailWrapper">'
            + '<img class="thumbnail" src="'+thumbnailUrl+'" />'
            + '<span class="duration">'+ video.durationText +'</span></div>'
            + '<div class="contentDetail" title="'+video.title+'">'
            + '<div class="title">'+ video.title +'</div>'
            + '<div class="channelTitle">'+ video.channelTitle +'</div></div>'
            + '<button class="addMusic">추가</button></li>';
          searchResult.append(li);
        });
      });
    });
    return false;
  });
});
