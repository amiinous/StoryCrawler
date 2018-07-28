var Promise = require('bluebird')
var fs = require('fs')
var exec = require('child_process').exec
var request = require('request')
var path = require('path')
var requestSync = require('sync-request')

const genres = ['Horror', 'Romance', 'Mystery', 'Sci-Fi', 'Comedy']

const b = `curl -H 'Host: production.hooked.media'\\
-H 'X-Parse-Client-Version: i1.15.3'\\
-H 'Accept: */*'\\
-H 'X-Parse-Session-Token: r:e54ccca19ae7bb4bdba5f32bd80ee91d'\\
-H 'X-Parse-Application-Id: Vh382DiUoSheUIWSKkhhH7UV2e8KXeg0wtWh3W1i'\\
-H 'X-Parse-Client-Key: V9BdkdFFzHqxb7he0uEy05vdC7CXsfVUmg6Raxik'\\
-H 'X-Parse-Installation-Id: fac1c9ad-2331-4e62-8057-281dc53d02f5'\\
-H 'X-Parse-OS-Version: 11.3 (15E216)'\\
-H 'Accept-Language: en-us'\\
-H 'Content-Type: application/json; charset=utf-8'\\
-H 'User-Agent: HOOKED/240 CFNetwork/897.15 Darwin/17.5.0'\\
-H 'X-Parse-App-Build-Version: 240'\\
-H 'X-Parse-App-Display-Version: 3.10.2' --data-binary '{"genre":{"variant":0,"genreUID":"Horror","language":"en"},"includeStoryKeyPaths":["author"]}'\\
--compressed 'https://production.hooked.media/parse/functions/retrieveUnreadStories'`

const tt = `curl -H 'Host: production.hooked.media' -H 'X-Parse-Client-Version: i1.15.3' -H 'Accept: */*' -H 'X-Parse-Session-Token: r:e54ccca19ae7bb4bdba5f32bd80ee91d' -H 'X-Parse-Application-Id: Vh382DiUoSheUIWSKkhhH7UV2e8KXeg0wtWh3W1i' -H 'X-Parse-Client-Key: V9BdkdFFzHqxb7he0uEy05vdC7CXsfVUmg6Raxik' -H 'X-Parse-Installation-Id: fac1c9ad-2331-4e62-8057-281dc53d02f5' -H 'X-Parse-OS-Version: 11.3 (15E216)' -H 'Accept-Language: en-us' -H 'Content-Type: application/json; charset=utf-8' -H 'User-Agent: HOOKED/240 CFNetwork/897.15 Darwin/17.5.0' -H 'X-Parse-App-Build-Version: 240' -H 'X-Parse-App-Display-Version: 3.10.2' --data-binary '{"genre":{"variant":0,"genreUID":"Romance","language":"en"},"includeStoryKeyPaths":["author"]}' --compressed 'https://production.hooked.media/parse/functions/retrieveUnreadStories'`
const callExec = async (cmd, cb) => {
  exec(cmd, { maxBuffer: 1024 * 1000000 }, function(error, stdout, stderr) {
    cb(error, stdout)
  })
}

///////////////////
var headers = {
  Host: 'production.hooked.media',
  'X-Parse-Client-Version': 'i1.15.3',
  Accept: '*/*',
  'X-Parse-Session-Token': 'r:e54ccca19ae7bb4bdba5f32bd80ee91d',
  'X-Parse-Application-Id': 'Vh382DiUoSheUIWSKkhhH7UV2e8KXeg0wtWh3W1i',
  'X-Parse-Client-Key': 'V9BdkdFFzHqxb7he0uEy05vdC7CXsfVUmg6Raxik',
  'X-Parse-Installation-Id': 'fac1c9ad-2331-4e62-8057-281dc53d02f5',
  'X-Parse-OS-Version': '11.3 (15E216)',
  'Accept-Language': 'en-us',
  'Content-Type': 'application/json; charset=utf-8',
  'User-Agent': 'HOOKED/240 CFNetwork/897.15 Darwin/17.5.0',
  'X-Parse-App-Build-Version': '240',
  'X-Parse-App-Display-Version': '3.10.2',
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
}

const retreiveUnreadStories = async genre => {
  const retreiveUnreadStoriescURL = `curl -H 'Host: production.hooked.media' -H 'X-Parse-Client-Version: i1.15.3' -H 'Accept: */*' -H 'X-Parse-Session-Token: r:e54ccca19ae7bb4bdba5f32bd80ee91d' -H 'X-Parse-Application-Id: Vh382DiUoSheUIWSKkhhH7UV2e8KXeg0wtWh3W1i' -H 'X-Parse-Client-Key: V9BdkdFFzHqxb7he0uEy05vdC7CXsfVUmg6Raxik' -H 'X-Parse-Installation-Id: fac1c9ad-2331-4e62-8057-281dc53d02f5' -H 'X-Parse-OS-Version: 11.3 (15E216)' -H 'Accept-Language: en-us' -H 'Content-Type: application/json; charset=utf-8' -H 'User-Agent: HOOKED/240 CFNetwork/897.15 Darwin/17.5.0' -H 'X-Parse-App-Build-Version: 240' -H 'X-Parse-App-Display-Version: 3.10.2' --data-binary '{"genre":{"variant":0,"genreUID":"${genre}","language":"en"},"includeStoryKeyPaths":["author"],"pageSpecification": {"limit": 1000}}' --compressed 'https://production.hooked.media/parse/functions/retrieveUnreadStories'`
  var dataString = `{"genre":{"variant":0,"genreUID":"${genre}","language":"en"},"includeStoryKeyPaths":["author"],"pageSpecification": {"limit": 1000}}`

  var options = {
    url:
      'https://production.hooked.media/parse/functions/retrieveUnreadStories',
    method: 'POST',
    headers: headers,
    body: dataString,
  }

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      fs.writeFile(`./Hooked_Stories/${genre}_Stories.json`, body, () => {
        console.log(`finished saving genre: ${genre}`)
      })
    } else {
      console.log(error)
    }
  })
}

const getseriesIdentifiersByGenre = genre => {
  fs.readFile(`./Hooked_Stories/${genre}_Stories.json`, (err, data) => {
    if (!err) {
      const stories = JSON.parse(data).result.stories
      stories.forEach(story => {
        // console.log(story.seriesIdentifier)
        getEpisodesBySeriesIndetifier(story.seriesIdentifier, genre)
      })
    } else {
      console.log('Error reading file: ', err)
    }
  })
}

const getIdsFromEpisodes = episodePath => {
  if (fs.existsSync(episodePath)) {
    const episodes = JSON.parse(fs.readFileSync(episodePath)).result.stories
    const storyPath = episodePath.replace('Episodes.json', '')
    episodes.forEach(episode => {
      console.log(storyPath + episode.title + '_messages')
      retrieveMessagesSync(
        episode.objectId,
        storyPath + episode.title + '_messages.json',
      )
    })
  }
}

const retrieveMessages = (id, savePath) => {
  var dataString = `{
    "force": false,
    "story": "${id}"
  }`

  var options = {
    url: 'https://production.hooked.media/parse/functions/retrieveMessages',
    method: 'POST',
    headers: headers,
    body: dataString,
  }

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      fs.writeFileSync(savePath, body)
      console.log(`finished saving messages path: ${savePath}`)
    } else {
      console.log(error)
    }
  })
}

const retrieveMessagesSync = (id, savePath) => {
  var dataString = `{
    "force": false,
    "story": "${id}"
  }`

  const url = 'https://production.hooked.media/parse/functions/retrieveMessages'
  var options = {
    headers: headers,
    body: dataString,
  }

  const body = requestSync('POST', url, options).getBody('utf8')
  fs.writeFileSync(savePath, body)
  console.log(`finished saving messages path: ${savePath}`)
}

const getEpisodesBySeriesIndetifier = (id, genre) => {
  var dataString = `{"seriesIdentifier":"${id}"}`

  var options = {
    url:
      'https://production.hooked.media/parse/functions/retrieve_episodes_in_series',
    method: 'POST',
    headers,
    body: dataString,
  }
  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const seriesTitle = JSON.parse(body).result.stories[0].seriesTitle
      const savingDir = `./Hooked_Stories/${genre}/${seriesTitle}`
      if (!fs.existsSync(savingDir)) {
        fs.mkdirSync(savingDir)
      }

      fs.writeFile(`${savingDir}/Episodes.json`, body, () => {
        console.log(`finished saving episodes: ${seriesTitle}`)
      })
    } else {
      console.log(error)
    }
  })
}

const getDirectories = source => {
  const isDirectory = s => fs.lstatSync(s).isDirectory()
  return fs
    .readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory)
}

const crawlStoriesByGenre = genre => {
  const stories = getDirectories(`./Hooked_Stories/${genre}/`)
  console.log(stories)
  stories.forEach(story => {
    getIdsFromEpisodes(story + '/Episodes.json')
  })
}

crawlStoriesByGenre('Comedy')

// getIdsFromEpisodes(
//   `Hooked_Stories/Romance/The Thirty-Year-Old Virgin/Episodes.json`,
// )

// getseriesIdentifiersByGenre('Sci-Fi')

// Promise.map(genres, genre => {
//   retreiveUnreadStories(genre)
// })
