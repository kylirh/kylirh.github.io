$(document).ready(function(){
  $(document).click(function(){
    $('.wrapper').css('display','block');
     $('.disk').css('display','none');
   playmusic();
    $(document).unbind();
  });
});

function playmusic(){
  var song = $('#tune');
  song.trigger('play');
}

function toggle_playback( sourceId ) {
  audio = document.getElementById(sourceId);
  button = document.getElementById(sourceId + "-control");
  if( audio.paused ) {
    audio.play();
    button.value='SOUND OFF';
  } else {
    audio.pause();
    button.value='SOUND ON';
  }
}
