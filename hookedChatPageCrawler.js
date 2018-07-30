const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const createChatPage = require('./hookedChatPageCreator')

async function run() {
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
      const poster = JSON.parse(
        fs.readFileSync(
          path.join(
            __dirname,
            'Hooked_Stories',
            category,
            story,
            'Episodes.json',
          ),
        ),
      ).result.stories[0].coverImageFile.url

      // console.log(poster)
      const episodes = await _episodes.filter(
        ep => ep.indexOf('_messages.json') !== -1,
      )
      // console.log(episodes)
      await Promise.map(episodes, async episode => {
        const episodeName = episode.substring(
          0,
          episode.indexOf('_messages.json'),
        )
        const episodeChatPage = await createChatPage(
          category,
          story,
          episode,
          episodeName,
          poster,
        )
        console.log(`html created: ${category}/${story}/${episodeName}`)

        // console.log(episodeChatPage)
        // await savePDF(episodeChatPage, episodeName)
      })
    })
  })
}

run()
