const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const createChatPage = require('./chatPageCreator')

async function run() {
  if (fs.existsSync(path.join(__dirname, 'stats.csv'))) {
    fs.unlinkSync(path.join(__dirname, 'stats.csv'))
    fs.appendFileSync(
      path.join(__dirname, 'stats.csv'),
      `seriesTitle,genre,metascore,started_android,completed_android,completed_ios,started_ios,readCount,loveCount,editorsChoice\n`,
    )
  }

  const _categories = await fs.readdirSync(
    path.join(__dirname, 'Hooked_Stories'),
  )
  const categories = await _categories.filter(
    cat => cat.indexOf('.json') === -1,
  )
  // console.log(categories)
  await Promise.map(categories, async category => {
    stories = await fs.readdirSync(
      path.join(__dirname, 'Hooked_Stories', category),
    )
    await Promise.map(stories, async story => {
      _episodes = await fs.readdirSync(
        path.join(__dirname, 'Hooked_Stories', category, story),
      )
      const result = JSON.parse(
        await fs.readFileSync(
          path.join(
            __dirname,
            'Hooked_Stories',
            category,
            story,
            'Episodes.json',
          ),
        ),
      ).result.stories[0]
      // console.log(result.genre, result.metascore)
      fs.appendFileSync(
        path.join(__dirname, 'stats.csv'),
        `${result.seriesTitle.replace(/,/g, ' ')},${result.genre},${
          result.metascore
        },${result.started_android},${result.completed_android},${
          result.completed_ios
        },${result.started_ios},${result.readCount},${result.loveCount},${
          result.editorsChoice
        }\n`,
      )
    })
  })
}

run()
