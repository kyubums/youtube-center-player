# YOUTUBE-CENTER-PLAYER #

중앙집중 유튜브 플레이어

### 뭐하는 놈인가요? ###

* 실행된 머신에서 플레이 리스트에 해당하는 노래를 재생합니다.
* 현재재생정보, 투표, 등록, 플레이리스트 기능이 포함된 웹페이지를 제공합니다.
* 현재 재생중인 음악에 특정 인원 이상이 투표하면 다음곡으로 넘어갑니다.


### 무엇으로 만들어져 있나요? ###

* [youtube-audio-stream](https://www.npmjs.com/package/youtube-audio-stream)
	* 유튜브 주소로 stream 을 만듬
	* 예제 참조
	
* [youtube-node](https://www.npmjs.com/package/youtube-node)
	* YOUTUBE DATA API
	
* [express](http://expressjs.com/ko/)
	* 웹 서버 프레임웍


### dependency ###

* speaker.js
```
On Debian/Ubuntu, the ALSA backend is selected by default, so be sure to have the alsa.h header file in place:

$ sudo apt-get install libasound2-dev
```

* youtube-audio-strea
	* ffmpeg 설치해야함.
	* 자세한 내용은 생략
	