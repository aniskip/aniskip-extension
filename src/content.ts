const sectionTitle = document.getElementsByClassName('section-title');
if (sectionTitle) {
  sectionTitle[0].innerHTML = 'hello worlds';
}

// Helper function to capitalize the first letter
function capitalizeFirstLetter(str: String) {
  return str[0].toUpperCase() + str.slice(1);
}

/**  Get provider name, provider anime id and anime episode number from current url
 * @returns A tuple of (providerName, animeId and episodeNumber)
 */
async function getDataFromCurrentUrl() {
  const { pathname, hostname } = await window.location;
  let regex = /(?:[^.\n]*\.)?([^.\n]*)(\..*)/;
  const providerName = capitalizeFirstLetter(hostname.replace(regex, ''));

  let idEpsNumber: String[] = [];
  let cleansedPath;
  switch (providerName) {
    case 'Aniwatch':
      regex = /anime\//;
      cleansedPath = pathname.replace(regex, '');
      regex = /\//;
      idEpsNumber = cleansedPath.split(regex);
      break;
    case 'Gogoanime':
      regex = /-episode-/;
      idEpsNumber = pathname.split(regex);
      break;
    case '9Anime':
      regex = /.*\./;
      cleansedPath = pathname.replace(regex, '');
      regex = /\./;
      idEpsNumber = cleansedPath.split(regex);
      break;
    default:
      idEpsNumber = ['', ''];
      break;
  }
  const result = idEpsNumber.unshift(providerName);
  return result;
}

/** Get MAL id from API with provided providerName and anime_id
 * @param providerName Provider name, first letter must be capitalized if possible
 * @param anime_id Anime id for the specified provider, no uniform format
 * @returns malId
 */
async function getMALId(providerName: String, anime_id: String) {
  try {
    const res = await fetch(
      `https://api.malsync.moe/page/${providerName}/${anime_id}`
    );
    const json = await res.json();
    return json.malId;
  } catch (err) {
    throw new Error('No MalID');
  }
}

/** Get most voted time segments from given skip times
 * @param entries entries[0] contains OP skip times; entries[1] contains ED skip times
 * @returns [OP,ED]
 */
function timeSkip(entries: any[]) {
  const opjson = entries[0].map((entry) => {
    let {
      skip_id,
      anime_id,
      episode_number,
      provider_name,
      skip_type,
      votes,
      start_time,
      end_time,
      episode_length,
      submit_date,
    } = entry;
    return entry;
  });

  const edjson = entries[0].map((entry) => {
    let {
      skip_id,
      anime_id,
      episode_number,
      provider_name,
      skip_type,
      votes,
      start_time,
      end_time,
      episode_length,
      submit_date,
    } = entry;
    return entry;
  });

  let maxVote = Number.MIN_SAFE_INTEGER;
  let maxOpIndex = -1;
  // Get index of most voted OP skip time
  for (let i = 0; i < opjson.length; i += 1) {
    if (parseInt(opjson[i][6], 10) > maxVote) {
      maxOpIndex = i;
    }
  }

  let maxEdIndex = -1;
  maxVote = Number.MIN_SAFE_INTEGER;
  // Get index of most voted ED skip time
  for (let i = 0; i < opjson.length; i += 1) {
    if (parseInt(edjson[i][6], 10) > maxVote) {
      maxEdIndex = i;
    }
  }

  return [opjson[maxOpIndex], edjson[maxEdIndex]];
}
exports = {
  timeSkip,
  getMALId,
  capitalizeFirstLetter,
  getDataFromCurrentUrl,
};
