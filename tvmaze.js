/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  const showsArr = [];
  const shows = res.data;

  for(let show of shows) {
    showsArr.push(new Show(show.show.id, show.show.name, show.show.summary, show.show.image.original));
    };
    console.log(showsArr);
    return showsArr;
}

class Show {
  constructor(id, name, summary, image) {
    this.id = id,
    this.name = name,
    this.summary = !summary ? '' : summary,
    this.image = !image ? 'https://tinyurl.com/tv-missing' : image
  }
}

class Episodes extends Show {
  constructor(id, name, season, number) {
    super(id, name);
    this.season = season;
    this.number = number;
  }
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id="show-episodes" data-show-id="${show.id}">Show Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

$("#shows-list").on("click", async function handleGet (e) {
  e.preventDefault();
  const show = e.target;

  let episodes = await getEpisodes(show.dataset.showId);

  populateEpisodes(episodes);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = res.data
  const episodesArr = [];
  for(let episode of episodes) {
    episodesArr.push( new Episodes(episode.id, episode.name, episode.season, episode.number));
  }
  return episodesArr;
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  $("#episodes-list").show();

  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name}, season ${episode.season}, number ${episode.number}</li>`
      );

    $episodesList.append($item);
  }
  $("#episodes-area").show();
}