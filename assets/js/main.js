
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
    songs:  [
        {
            name: '此生过半 - DJ阿卓版',
            singer: 'China',
            path: './assets/music/song1.mp3',
            image: './assets/images/song1.jpg'
        },
        {
            name: '此生过半 - DJ阿卓版',
            singer: 'China',
            path: './assets/music/song2.mp3',
            image: './assets/images/song2.jpg'
        },
        {
            name: '此生过半 - DJ阿卓版',
            singer: 'China',
            path: './assets/music/song3.mp3',
            image: './assets/images/song3.jpg'
        },
        {
            name: '太想念',
            singer: 'China',
            path: './assets/music/song4.mp3',
            image: './assets/images/song4.jpg'
        },
        {
            name: '赤伶',
            singer: 'China',
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
    render: function() {
        const htmls = this.songs.map(function(song, index) {
            return `
                    <div class="song ">
                    <div class="song__number">${index + 1}</div>
                    <div class="song__bnt-tonggle">
                        <i class="fa-solid fa-pause song__btn_tonggle-play"></i>
                        <i class="fa-solid fa-play song__btn_tonggle-pause"></i>
                    </div>
                    <div class="song__name">${song.name}</div>
                    <div class="song__duration">4:05</div>
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
            `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperty: function (){
        Object.defineProperty(this, 'currentSong' ,{
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function() {
        infoSong.textContent = this.currentSong.name;
        imgSong.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        console.log(this.currentSong.path)
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
            _this.nextSong();
            audio.play();
        }

        // Prev song
        btnPrev.onclick = function() {
            _this.prevSong();
            audio.play();
        }

        btnRandom.onclick = function(){
            _this.isRandom = !_this.isRandom;
            btnRandom.classList.tonggle('active', _this.isRandom);
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
    },
    start: function() {
        this.defineProperty();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();
        
    }
}

appMusicPlayer.start();

