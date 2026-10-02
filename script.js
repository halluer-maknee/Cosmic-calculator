const display = document.getElementById("display");

let expression = "";
let currentAudio = null;

let lyricInterval = null;
let progressInterval = null;


/*
====================================================
LYRIC TIMELINES
====================================================

time = seconds from the beginning of the audio.

You can change the timestamps to match the exact
moment each lyric is sung in your audio file.

Only use lyric text that you are authorized to use.
*/

const songs = {

  pagibig: {

    title: "Pag-Ibig — Ace Banzuelo",

    audio: document.getElementById("pagIbig"),

    lyrics: [
{ time: 0,  text: "Kung meron man nagpaparamdam..." },
{ time: 4,  text: "Nilalayo ang sarili" },
{ time: 7,  text: "Ayaw matulad sa dati" },
{ time: 11, text: "'Di ko alam ang dapat sabihin" },
{ time: 15, text: "'Di ko alam ang dapat aminin" },
{ time: 22, text: "'Di ko alam kung kailan, paano" },
{ time: 27, text: "Nalimutang pag-ibig" },
{ time: 29, text: "Meron bang pipili sa 'kin?" },
{ time: 32, text: "Meron ba?" },
{ time: 34, text: "Meron ba?" },
{ time: 36, text: "Meron bang pipili sa 'kin?" },
{ time: 39, text: "Meron ba?" },
{ time: 41, text: "Meron ba?" },
{ time: 43, text: "Meron bang pipili sa 'kin?" },
{ time: 46, text: "Meron ba?" },
{ time: 48, text: "Meron ba?" },
{ time: 50, text: "Meron bang pipili sa 'kin?" }
{ time: 53, text: "Oh" }
]

  },


  sino: {

    title: "Sino — Unique",

    audio: document.getElementById("sino"),

    lyrics: [

      { time: 0, text: "Sino ang..." },

      { time: 4, text: "Sino?" },

      { time: 8, text: "Bakit hindi alam kung bakit" },

      { time: 12, text: "Laging sa akin lumalapit" },

      { time: 16, text: "Kahit minsan ako'y nagkulang" },

      { time: 21, text: "Kahulugan ng pag-ibig" }

    ]

  },


  niki: {

    title: "NIKI — custom track",

    audio: document.getElementById("niki"),

    lyrics: [

      { time: 0, text: "The goo goo dolls..." },

      { time: 5, text: "The way you should be too" },

      { time: 10, text: "Maybe I'm just..." },

      { time: 15, text: "I don't know what to do" },

      { time: 20, text: "Sometimes you..." }

    ]

  }

};


/* =================================================
   CALCULATOR
================================================= */

function press(value) {

  expression += value;

  display.textContent = expression;

}


function clearDisplay() {

  expression = "";

  display.textContent = "0";

}


function backspace() {

  expression = expression.slice(0,-1);

  display.textContent = expression || "0";

}


/* =================================================
   CALCULATE
================================================= */

function calculate() {

  const equation = expression.replace(/\s/g,"");

  let answer;

  try {

    /*
      Calculator only accepts numbers and operators.
    */

    if (!/^[0-9+\-*/%.()]+$/.test(equation)) {

      throw new Error();

    }

    answer = Function(
      `"use strict"; return (${equation})`
    )();

    if (!Number.isFinite(answer)) {

      throw new Error();

    }

  }

  catch {

    display.textContent = "Error";

    return;

  }


  display.textContent = answer;


  /*
  ================================================
  SPECIAL EQUATIONS
  ================================================
  */

  if (equation === "2+2") {

    playSong("pagibig");

  }

  else if (equation === "10+8") {

    playSong("sino");

  }

  else if (equation === "7+11") {

    playSong("niki");

  }

  else {

    stopSong();

  }

}


/* =================================================
   PLAY SONG
================================================= */

function playSong(songName) {

  const song = songs[songName];

  stopSong();


  document.getElementById("songTitle").textContent =
    song.title;


  currentAudio = song.audio;

  currentAudio.currentTime = 0;


  /*
  Start audio.
  Because this happens after a calculator click,
  browsers normally allow playback.
  */

  currentAudio.play().catch(error => {

    console.log("Audio needs user interaction:", error);

  });


  /*
  Check the audio time every 50ms.
  */

  lyricInterval = setInterval(() => {

    updateLyrics(song);

  },50);


  /*
  Update progress bar.
  */

  progressInterval = setInterval(() => {

    if (
      currentAudio.duration &&
      !isNaN(currentAudio.duration)
    ) {

      const percent =
        (currentAudio.currentTime /
        currentAudio.duration) * 100;

      document.getElementById("progressBar")
        .style.width = percent + "%";

    }

  },100);

}


/* =================================================
   SYNCHRONIZED LYRICS
================================================= */

function updateLyrics(song) {

  const currentTime =
    currentAudio.currentTime;


  /*
  Find the LAST lyric whose timestamp
  has already been reached.
  */

  let currentLyric = song.lyrics[0];


  for (let i = 0; i < song.lyrics.length; i++) {

    if (currentTime >= song.lyrics[i].time) {

      currentLyric = song.lyrics[i];

    }

  }


  document.getElementById("lyrics").textContent =
    currentLyric.text;

}


/* =================================================
   STOP
================================================= */

function stopSong() {

  if (currentAudio) {

    currentAudio.pause();

    currentAudio.currentTime = 0;

  }


  clearInterval(lyricInterval);

  clearInterval(progressInterval);


  document.getElementById("progressBar")
    .style.width = "0%";

}


/* =================================================
   KEYBOARD SUPPORT
================================================= */

document.addEventListener("keydown", event => {

  if (
    /^[0-9.]$/.test(event.key)
  ) {

    press(event.key);

  }

  else if (
    "+-*/%".includes(event.key)
  ) {

    press(event.key);

  }

  else if (
    event.key === "Enter" ||
    event.key === "="
  ) {

    calculate();

  }

  else if (
    event.key === "Backspace"
  ) {

    backspace();

  }

  else if (
    event.key === "Escape"
  ) {

    clearDisplay();

  }

});
