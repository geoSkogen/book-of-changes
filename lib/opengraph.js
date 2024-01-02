class OpenGraph {

  #properties = {}
  #hexagrams = []

  constructor(hexagrams_array) {

    if (typeof Hexagram != 'function') {
      console.log('OpenGraph::constructor could not locate a Hexagram class definition.')
    }

    if (Array.isArray(hexagrams_array)) {
      hexagrams_array.forEach( (hexagram_obj) => {
        if (hexagram_obj instanceof Hexagram) {
          this.#hexagrams.push(hexagram_obj)
        } else {
          console.log('OpenGraph::constructor expects an array of Hexagram objects as an argument.')
        }
      })
    } else {
      console.log('OpenGraph::constructor expects an array as an argument.')
    }
  }

  renderBasicMetaTags() {
    let title_tag = document.createElement('meta')
    let url_tag = document.createElement('meta')
    let type_tag = document.createElement('meta')
    let image_tag = document.createElement('meta')
    let favicon_tag = document.querySelector('link[rel="icon"]')

    let title = this.#hexagrams[0].title.original +
      (this.#hexagrams[1] ? ' becoming ' + this.#hexagrams[1].title.original : '')
    let url = window.location.origin + window.location.pathname + '?id=' + this.#hexagrams[0].number.toString()
    let type_str = 'website'
    let image_url = favicon_tag ? favicon_tag.href.replace(/\/?\.\./g,'') : ''

    if (this.#hexagrams[1]) {
      url += '&moving_lines='
      this.#hexagrams[0].movingLines.forEach( (line_index) => {
        url += (line_index+1).toString()
      })
    }

    title_tag.setAttribute('property','og:title')
    url_tag.setAttribute('property','og:url')
    type_tag.setAttribute('property','og:type')
    image_tag.setAttribute('property','og:image')

    title_tag.setAttribute('content',title)
    url_tag.setAttribute('content',url)
    type_tag.setAttribute('content',type_str)
    image_tag.setAttribute('content',image_url)

    document.head.appendChild(title_tag)
    document.head.appendChild(url_tag)
    document.head.appendChild(type_tag)
    document.head.appendChild(image_tag)
  }

  renderDescriptionTag() {
    let description_tag = document.createElement('meta')
    let description = this.#hexagrams[0].getGeneralPurport('inner') + ' ' +
      this.#hexagrams[0].getGeneralPurport('outer')
    description_tag.setAttribute('property','og:description')
    description_tag.setAttribute('content',description)
    document.head.appendChild(description_tag)
  }

  render() {
    this.renderBasicMetaTags()
    this.renderDescriptionTag()
  }
}
