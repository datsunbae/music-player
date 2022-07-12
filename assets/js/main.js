
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playList = $('.playlist');
const infoSong = $('.now-playing__name-song');
const imgSong = $('.cd-box__thumb-song');
const audio = $('#audio');
const play = $('.control__btn-tonggle');
const progress = $('#progress');
const btnNext = $('.control__btn-next');
const btnPrev = $('.control__btn-prev');
const btnRandom = $('.control__btn-random');
const btnRepeat = $('.control__btn-repeat');

const appMusicPlayer = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs:  [
        {
            name: '此生过半 - DJ阿卓版',
            singer: '豆包',
            path: './assets/music/song1.mp3',
            image: './assets/images/song1.jpg'
        },
        {
            name: '此生过半 - DJ阿卓版',
            singer: '豆包',
            path: './assets/music/song2.mp3',
            image: './assets/images/song2.jpg'
        },
        {
            name: '此生过半 - DJ阿卓版',
            singer: '豆包',
            path: './assets/music/song3.mp3',
            image: './assets/images/song3.jpg'
        },
        {
            name: '太想念',
            singer: '彭筝',
            path: './assets/music/song4.mp3',
            image: './assets/images/song4.jpg'
        },
        {
            name: '赤伶',
            singer: '彭筝',
            path: './assets/music/song5.mp3',
            image: './assets/images/song5.jpg'
        },
        {
            name: 'Lời em nói',
            singer: 'H2K',
            path: './assets/music/song6.mp3',
            image: './assets/images/song6.jpg'
        },
        {
            name: 'Vũ Trụ HUSTLANG !',
            singer: 'Robe',
            path: './assets/music/song7.mp3',
            image: './assets/images/song7.jpg'
        },
        {
            name: 'Vượt chướng ngại vật',
            singer: 'Blacka',
            path: './assets/music/song8.mp3',
            image: './assets/images/song8.jpg'
        },
        {
            name: 'HOTXOAN',
            singer: 'Anh Phan',
            path: './assets/music/song9.mp3',
            image: './assets/images/song9.jpg'
        },
        {
            name: 'TOPDAWG',
            singer: 'Anh Phan with Larria., B-Wine & MinhLai',
            path: './assets/music/song10.mp3',
            image: './assets/images/song10.jpg'
        }
    ],
    render: async function() {
        const _this = this;

        playList.innerHTML = '';
        for(let i=0; i<this.songs.length; i++) {
            let audioCurrent = document.createElement("audio");
            audioCurrent.src = this.songs[i].path;
            let time = await this.getDuration(audioCurrent)/60;
            
            playList.insertAdjacentHTML('beforeend', `
                        <div class="song ${i === this.currentIndex ? 'song-active' : ''}" data-index = ${i}>
                        <div class="song__number">${i + 1}</div>
                        <div class="song__bnt-tonggle">
                            <i class="fa-solid fa-pause song__btn_tonggle-play"></i>
                            <i class="fa-solid fa-play song__btn_tonggle-pause"></i>
                        </div>
                        <div class="song__name">${this.songs[i].name}</div>
                        <div class="song__duration">${time.toString().split(".")[0]}:${((time % 1)*60).toFixed(0)}</div>
                    
                        <div class="song-hover">
                            <div class="song-hover__btn-heart">
                            <i class="fa-regular fa-heart song-hover__btn-heart--empty"></i>
                            <i class="fa-solid fa-heart song-hover__btn-heart--cover"></i>
                        </div>
                        <div class="song-hover__btn-option">
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                    </div>
                </div>
                `)
        } 
    },
    getDuration: function(song){
        return new Promise(function(resolve){
            song.addEventListener('loadedmetadata', () => {
                let time = song.duration;
                resolve(time);
            })
        })
    },
    defineProperty: function (){
        Object.defineProperty(this, 'currentSong' ,{
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function() {
        infoSong.textContent = `${this.currentSong.name} - ${this.currentSong.singer}`;
        imgSong.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    handleEvent: function(){
        const _this = this;

        const cdAnimate = imgSong.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimate.pause();

        // Click button play
        play.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        // Play
        audio.onplay = function(){
            _this.isPlaying = true;
            play.classList.add('control__btn-tonggle-playing');
            cdAnimate.play();
        }

        // Pause
        audio.onpause = function(){
            _this.isPlaying = false;
            play.classList.remove('control__btn-tonggle-playing');
            cdAnimate.pause();
        }

        // Process
        audio.ontimeupdate = function(){
            let progressPercent = 0;
            if(audio.duration){
                progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Seek
        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Next song
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            (async function(){
                await _this.render();
                _this.scrollToSong();
            })()
           
           
        }

        // Prev song
        btnPrev.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
            }
            else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToSong();
            
        }

        // Random song
        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom;
            if(_this.isRepeat) {
                _this.isRepeat = !_this.isRepeat;
                btnRepeat.classList.toggle("active", _this.isRepeat); 
            }
            btnRandom.classList.toggle("active", _this.isRandom);
        }

        // Repeat song
        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            if(_this.isRandom) {
                _this.isRandom = !_this.isRandom;
                btnRandom.classList.toggle("active", _this.isRandom);
            }
            btnRepeat.classList.toggle("active", _this.isRepeat);
        }

        // End Song
        audio.onended = function(){
            _this.handleAutoChangeSong();
            _this.render();
            _this.scrollToSong();
        }
    },
    nextSong: function(){
        this.currentIndex++;

        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;

        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },
    randomSong: function(){
        var newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToSong: function(){
         $('.song.song-active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })
    },
    handleAutoChangeSong: function(){
        if(!this.isRepeat){
            this.nextSong();
        }
        if(this.isRandom){
            this.randomSong();
        }
        progress.value = 0;
        audio.play();
    },
    start: function() {
        this.defineProperty();
        this.handleEvent();
        this.loadCurrentSong();
        this.render(); 
    }
}

appMusicPlayer.start();

