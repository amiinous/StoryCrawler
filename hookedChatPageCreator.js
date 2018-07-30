const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const template = path.join(__dirname, 'chatPageTemplate.ejs')

module.exports = async function create(
  category,
  story,
  episode,
  episodeName,
  poster,
) {
  const ejsTemplate = fs.readFileSync(template, {
    encoding: 'utf8',
  })
  const episodeData = await fs.readFileSync(
    path.join(__dirname, 'Hooked_Stories', category, story, episode),
    { encoding: 'utf8' },
  )
  const result = JSON.parse(episodeData).result
  let mainCharacter = ''
  let ind = 0
  do {
    if (result.messages[ind].sender) {
      mainCharacter = result.messages[ind].sender.name
      break
    }
    ind += 1
  } while (ind < result.messages.length)

  const html = ejs.render(ejsTemplate, {
    name: episodeName,
    episode: result,
    poster: poster,
    mainCharacter,
  })
  await fs.writeFileSync(
    `${__dirname}/htmls/${category}_${story}_${episodeName}.html`,
    html,
    'utf8',
  )
  // console.log(html)
  // return html
}

// create(
//   'Romance',
//   'Alexis the Virgin',
//   'Alexis the Virgin_messages.json',
//   'Alexis the Virgin',
//   'https://d3b7s6bg6ueiky.cloudfront.net/mfp_cd30bde4292d2220d4ecbe82784636b1281.jpg',
// )
