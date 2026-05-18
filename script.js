const API_KEY = "2002c5c39054062b95d1ab4a47a01402";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let currentMovie = null;

/* =========================
   LOAD MOVIES
========================= */

fetchTrending();
fetchTopRated();
fetchAction();
fetchComedy();

/* =========================
   FETCH TRENDING
========================= */

async function fetchTrending(){

  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );

  const data = await res.json();

  showMovies(data.results,"movies");

  if(data.results.length > 0){

    setBanner(data.results[0]);
  }
}

/* =========================
   FETCH TOP RATED
========================= */

async function fetchTopRated(){

  const res = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
  );

  const data = await res.json();

  showMovies(data.results,"toprated");
}

/* =========================
   FETCH ACTION
========================= */

async function fetchAction(){

  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`
  );

  const data = await res.json();

  showMovies(data.results,"action");
}

/* =========================
   FETCH COMEDY
========================= */

async function fetchComedy(){

  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`
  );

  const data = await res.json();

  showMovies(data.results,"comedy");
}

/* =========================
   SEARCH PREMIUM FIX
========================= */

const searchInput =
document.getElementById("search");

let searchTimeout;

searchInput.addEventListener("keyup", () => {

  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(async () => {

    const query =
    searchInput.value.trim();

    // kalau kosong
    if(query.length === 0){

      fetchTrending();
      fetchTopRated();
      fetchAction();
      fetchComedy();

      return;
    }

    try{

      // SEARCH MOVIE
      const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
      );

      const data = await res.json();

      // hasil search tampil di trending
      showMovies(data.results,"movies");

      // banner ikut berubah
      if(data.results.length > 0){

        setBanner(data.results[0]);
      }

      // tetap tampil TOP RATED
      fetchTopRated();

      // tetap tampil ACTION
      fetchAction();

      // tetap tampil COMEDY
      fetchComedy();

    }catch(err){

      console.log(err);
    }

  },500);

});

/* =========================
   SHOW MOVIES
========================= */

function showMovies(movies,id){

  const container =
  document.getElementById(id);

  container.innerHTML = "";

  movies.forEach(movie=>{

    if(!movie.poster_path) return;

    const card =
    document.createElement("div");

    card.classList.add("movie-card");

    card.innerHTML = `
      <img
        src="${IMG_URL + movie.poster_path}"
        alt="${movie.title}"
      >

      <div class="movie-info">

        <h3>${movie.title}</h3>

        <button class="watch-btn">
          ▶ Watch Trailer
        </button>

      </div>
    `;

    card.onclick = ()=>{

      currentMovie = movie;

      openTrailer(movie.id);
    };

    container.appendChild(card);

  });
}

/* =========================
   OPEN TRAILER
========================= */

async function openTrailer(movieId){

  try{

    const res = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );

    const data = await res.json();

    const trailer =
    data.results.find(
      v =>
      v.site === "YouTube" &&
      (
        v.type === "Trailer" ||
        v.type === "Teaser"
      )
    );

    if(!trailer){

      alert("Trailer tidak tersedia");
      return;
    }

    document.getElementById("video").src =
    `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;

    document.getElementById("modal")
    .style.display = "block";

  }catch(err){

    console.log(err);

    alert("Trailer gagal diputar");
  }
}

/* =========================
   SET BANNER
========================= */

async function setBanner(movie){

  currentMovie = movie;

  const banner =
  document.getElementById("banner");

  banner.style.backgroundImage =
  `url(${IMG_URL + movie.backdrop_path})`;

  document.getElementById("banner-title")
  .innerText = movie.title;

  document.getElementById("banner-desc")
  .innerText = movie.overview;

  try{

    const res = await fetch(
      `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
    );

    const data = await res.json();

    const trailer =
    data.results.find(
      v =>
      v.site === "YouTube" &&
      (
        v.type === "Trailer" ||
        v.type === "Teaser"
      )
    );

    if(trailer){

      document.getElementById("bannerVideo").src =
      `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&rel=0`;
    }

  }catch(err){

    console.log(err);
  }
}

/* =========================
   PLAY BUTTON
========================= */

document.getElementById("playBanner")
.onclick = ()=>{

  if(currentMovie){

    openTrailer(currentMovie.id);
  }
};

/* =========================
   CLOSE MODAL
========================= */

document.getElementById("close")
.onclick = ()=>{

  document.getElementById("modal")
  .style.display = "none";

  document.getElementById("video")
  .src = "";
};

window.onclick = (e)=>{

  if(e.target.id === "modal"){

    document.getElementById("modal")
    .style.display = "none";

    document.getElementById("video")
    .src = "";
  }
};

/* =========================
   NAVBAR EFFECT
========================= */

window.addEventListener("scroll",()=>{

  const nav =
  document.querySelector(".nav");

  if(window.scrollY > 50){

    nav.style.background =
    "rgba(0,0,0,.95)";

  }else{

    nav.style.background =
    "rgba(0,0,0,.7)";
  }
});