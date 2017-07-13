function refresh() {
  $.ajax({
    url: '/music',
    method: 'get',
    success: function(response) {
      var current = response.currentMusic;
      var musicList = response.musicList;

      var currentId = $('#current .vote').data('id');
      if (!currentId || currentId !== current.id) {
        $('#current .title').text(current.title);
        $('#current .description').text(current.description);
        $('#current .thumbnail').attr('src', current.thumbnailUrl);
        $('#current .vote').data('id', current.id);
      }

      var list = $('#playlist ul');
      var newFirst = musicList[0] || {};
      var newLast = musicList[musicList.length - 1] || {};
      if (
        list.children().first().data('id') === newFirst.id
        && list.children().last().data('id') === newLast.id
      ) return;
      list.empty();
      musicList.map(function(music) {
        list.append('<li data-id="' + music.id + '">' + music.title + '</li>');
      });
    },
    error: function(err) {
      console.log(err);
    },
  })
}

$(function() {
  refresh();
  setInterval(refresh, 5000);

  $('#addMusic').click(function() {
    var playId = $('#playId').val();
    $('#playId').val('');
    $.ajax({
      url: '/music',
      method: 'post',
      data: { playId: playId },
      success: function(response) {
        alert(response);
      },
      error: function(err) {
        alert(err.responseText);
      }
    })
  });

  $('#current .vote').click(function() {
    var id = $(this).data('id');
    $.ajax({
      url: '/music/vote',
      method: 'post',
      data: { id: id },
      success: function(response) {
        alert(response);
        setTimeout(refresh, 1000);
      },
      error: function(err) {
        alert(err.responseText);
        console.log(err);
      },
    })
  })
});
