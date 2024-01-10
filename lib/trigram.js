class Trigram {

  #number
  #lines = []
  #titleElement = ''
  #quality = ''
  #lineCharacter = ''
  #character = ''
  #name = ''

  constructor(number,lines,title,quality,char,line_char,name) {
    if (typeof number === 'number') {
      this.#number = number
    } else {
      console.log('Trigram::constructor expects an integer as argument 1.')
    }
    if (typeof lines === 'string' && lines.length === 3) {
      let valid_str = true
      lines.split('').forEach((line) => {
        if ( line!='0' && line!='1') {
          valid_str = false
          console.log('Trigram::constructor was passed an unrecognized character: ' + line + ' in argument 2.')
        }
      })
      if (valid_str) {
        this.#lines = lines.split('')
      }
    } else {
      console.log('Trigram::constructor expects a three-character string as argument 2.')
    }

    if (typeof title === 'string') {
      this.#titleElement = title
    } else {
      console.log('Trigram::constructor expects a string as argument 3.')
    }
    if (typeof quality === 'string') {
      this.#quality = quality
    } else {
      console.log('Trigram::constructor expects a string as argument 4.')
    }
    if (typeof char === 'string') {
      this.#character = char
    } else {
      console.log('Trigram::constructor expects a string as argument 5.')
    }
    if (typeof line_char === 'string') {
      this.#lineCharacter = line_char
    } else {
      console.log('Trigram::constructor expects a string as argument 6.')
    }
    if (typeof name === 'string') {
      this.#name = name
    } else {
      console.log('Trigram::constructor expects a string as argument 7.')
    }
  }

  get titleElement() {
    return this.#titleElement
  }

  get quality() {
    return this.#quality
  }

  get name() {
    return this.#name
  }

  get number() {
    return this.#number
  }

  get character() {
    return this.#character
  }

  get lineCharacter() {
    return this.#lineCharacter
  }

  get lines() {
    return this.#lines
  }

}
