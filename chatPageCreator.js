const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const template = path.join(__dirname, 'chatPageTemplate.ejs')

async function create(category, story, episode, episodeName) {
  const ejsTemplate = fs.readFileSync(template, {
    encoding: 'utf8',
  })
  const episodeData = await fs.readFileSync(
    path.join(__dirname, 'Hooked_Stories', category, story, episode),
    { encoding: 'utf8' },
  )

  const html = ejs.render(ejsTemplate, {
    name: episodeName,
    episode: JSON.parse(episodeData).result,
  })
  await fs.writeFileSync(`${__dirname}/file.html`, html, 'utf8')
  console.log(html)
  // return html
}

create(
  'Romance',
  'Alexis the Virgin',
  'Alexis the Virgin_messages.json',
  'Alexis the Virgin',
)
