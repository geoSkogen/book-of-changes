class Trigram {

  #lines = []
  #titleElement = ''
  #quality = ''
  #lineCharacter = ''
  #character = ''
  #name = ''

  constructor(lines,title,quality,line_char,char,name) {
    if (typeof lines === 'string' && lines.length === 3) {
      this.#lines = lines.split('')
    } else {
      console.log('Trigram::constructor expects a three-characters string as argument 1.')
    }
    if (typeof title === 'string') {
      this.#titleElement = title
    } else {
      console.log('Trigram::constructor expects a string as argument 2.')
    }
    if (typeof quality === 'string') {
      this.#quality = quality
    } else {
      console.log('Trigram::constructor expects a string as argument 3.')
    }
    if (typeof line_char === 'string') {
      this.#character = line_char
    } else {
      console.log('Trigram::constructor expects a string as argument 4.')
    }
    if (typeof char === 'string') {
      this.#character = char
    } else {
      console.log('Trigram::constructor expects a string as argument 5.')
    }
    if (typeof name === 'string') {
      this.#name = name
    } else {
      console.log('Trigram::constructor expects a string as argument 6.')
    }
  }
}
