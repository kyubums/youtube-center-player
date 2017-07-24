$.ajaxSetup({cache:false});

function refresh() {
  $.ajax({
    url: '/music',
    method: 'get',
    success: function(response) {
      var current = response.currentMusic;
      var musicList = response.musicList;

      var currentId = $('#current .vote').data('id');
      if (current.id && (!currentId || currentId !== current.id)) {
        $('#current .title').text('['+current.duration+']'+current.title);
        $('#current .description').text('등록 : ' + current.username);
        $('#current .thumbnail').attr('src', current.thumbnailUrl);
        $('#current .vote').data('id', current.id);
      } else if (!current.id) {
        $('#current .title').text('NO MUSIC PLAYING NOW');
        $('#current .description').text('');
        $('#current .thumbnail').attr('src', '');
      }

      $('#volume').val(current.volume);
      var list = $('#playlist ul');
      var newFirst = musicList[0] || {};
      var newLast = musicList[musicList.length - 1] || {};
      if (
        list.children().first().data('id') === newFirst.id
        && list.children().last().data('id') === newLast.id
      ) return;
      list.empty();
      musicList.map(function(music) {
        list.append('<li data-id="' + music.id + '">[' + music.duration + ']' + music.username + '_' + music.title + '</li>');
      });
    },
    error: function(err) {
      console.log(err);
    },
  })
}

$(function() {
  var username = readCookie('username');
  if (!username) {
    location.href = '/';
  }

  refresh();
  setInterval(refresh, 5000);

  $('body').on('click', '.addMusic', function() {
    if(!confirm('등록하시겠습니까?')) {
      return false;
    }
    var playId = $(this).parent().data('id');
    $.ajax({
      url: '/music',
      method: 'post',
      data: { playId: playId, username: username },
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
    var voted = readCookie('vote');
    if (!id) {
      alert('재생중인 음악이 없습니다.');
      return;
    }
    if (voted === id.toString()) {
      alert('이미 투표 했습니다!');
      return;
    }
    // 어뷰징 하지 마세요 ㅜㅜ
    $.ajax({
      url: '/music/vote',
      method: 'post',
      data: { id: id },
      success: function(response) {
        createCookie('vote', id);
        alert(response);
        refresh();
      },
      error: function(err) {
        alert(err.responseText);
        console.log(err);
      },
    })
  });

  $('#volume').change(function() {
    var v = $(this).val();
    $.ajax({
      url: '/music/volume',
      method: 'post',
      data: { v: v },
      success: function(response) {
        setTimeout(refresh, 500);
      },
      error: function(err) {
        alert(err.responseText);
        console.log(err);
      }
    })
  });
});
