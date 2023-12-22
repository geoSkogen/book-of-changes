class Hexagram {

  #number = 0
  #title = {}
  #name = {}
  #lineConfiguration = []
  #trigrams = {}
  #linePurports = {}
  #generalPurports = {}

  #movingLines = []

  #character = ''
  #lineCharacter = ''

  #isInner = undefined
  #isSovereign = undefined

  #innerHexagramIndex = 0
  #innermostHexagramIndex = 0
  #innerHexagramTitle = ''
  #innermostHexagramTitle = ''


  constructor(
    int,
    line_config_str,
    title_str,
    purport_inner_str,
    purport_outer_str,
    lines_inner_arr,
    lines_outer_arr,
    name_str,
    char,
    line_char,
    is_inner,
    is_sovereign
  )
  {
    if (Number(int) && int > 0) {
      this.#number = int
    } else {
      console.log('Hexagram::constructor expects a positive integer as argument 1.')
    }

    if (typeof line_config_str === 'string' && line_config_str.length === 6) {
      let valid_line_chars = [null,'0','1']
      let valid_config_lines_count = 0
      line_config_str.split('').forEach( (char) => {
        if (valid_line_chars.indexOf(char)) {
          valid_config_lines_count++
        } else {
          console.log('Hexagram::constructor did not recognize line config value ' + char)
        }
      })
      if (valid_config_lines_count===line_config_str.length) {
        this.#lineConfiguration = line_config_str.split('')
      } else {
        console.log('Hexagram::constructor was passed an invalid line config value.')
      }
    } else {
      console.log('Hexagram::constructor expects a string of six characters as argument 2.')
    }

    this.#generalPurports = {
      inner : purport_inner_str,
      outer : purport_outer_str
    }

    if (Array.isArray(lines_inner_arr) && Array.isArray(lines_outer_arr)) {
      this.#linePurports = {
        inner : lines_inner_arr,
        outer : lines_outer_arr
      }
    } else {
      console.log('Hexagram::constructor expects arrays for arguments 5 and 6.')
    }

    if (typeof title_str === 'string') {
      let title_aliases = title_str.split(' | ')
      if (title_aliases[0]) {
        this.#title = {
          original : title_aliases[0]
        }
      }
      if (title_aliases[1]) {
        this.#title.canonical = title_aliases[1]
      }
      if (title_aliases[2]) {
        this.#title.alias = title_aliases[2]
      }
    } else {
      console.log('Hexagram::constructor expects a string as argument 7.')
    }

    this.#name = name_str

    this.#character = char
    this.#lineCharacter = line_char

    this.#isInner = is_inner
    this.#isSovereign = is_sovereign

    this.#movingLines = []
  }


  get lines() {
    return this.#lineConfiguration
  }


  get linestr() {
    return this.#lineConfiguration.join('')
  }


  get trigramLines() {
    let linestr = this.linestr

    return [
      linestr[0] + linestr[1] + linestr[2],
      linestr[3] + linestr[4] + linestr[5]
    ]
  }


  get innerLines() {
    return [
      this.#lineConfiguration[1],
      this.#lineConfiguration[2],
      this.#lineConfiguration[3],
      this.#lineConfiguration[2],
      this.#lineConfiguration[3],
      this.#lineConfiguration[4],
    ].join('')
  }


  get innermostLines() {
    return [
      this.innerLines[1],
      this.innerLines[2],
      this.innerLines[3],
      this.innerLines[2],
      this.innerLines[3],
      this.innerLines[4],
    ].join('')
  }


  get title() {
    return this.#title
  }


  get number() {
    return this.#number
  }


  get name() {
    return this.#name
  }


  get character() {
    return this.#character
  }


  get lineCharacter() {
    return this.#lineCharacter
  }


  get isMoving() {
    if (this.#movingLines.length) {
      return true
    } else {
      return false
    }
  }


  get movingLines() {
    return this.#movingLines.length ?  this.#movingLines : null
  }


  get trigrams() {
    return this.#trigrams
  }


  get innerHexagramIndex() {
    return this.#innerHexagramIndex
  }


  get innermostHexagramIndex() {
    return this.#innermostHexagramIndex
  }


  get innerHexagramTitle() {
    return this.#innerHexagramTitle
  }


  get innermostHexagramTitle() {
    return this.#innermostHexagramTitle
  }


  setMovingLines(line_index_arr) {
    let valid = true
    if (Array.isArray(line_index_arr) && line_index_arr.length) {
      for (let i = 0; i < line_index_arr.length; i++) {
        if (typeof line_index_arr[i] != 'number' || line_index_arr[i] > 5) {
          valid = false
          break
        }
      }
      if (valid) {
        this.#movingLines = line_index_arr
      }
    }
  }


  setInnerHexagram(line_config_index,title_str) {

    if (typeof line_config_index != 'number') {
      console.log('Hexagram::setInnerHexagram expects an integer as arugment 1.')
      return
    }
    if (typeof title_str != 'string') {
      console.log('Hexagram::setInnerHexagram expects a string as argument 2.')
      return
    }

    this.#innerHexagramIndex = line_config_index
    this.#innerHexagramTitle = title_str
  }


  setInnermostHexagram(line_config_index,title_str) {

    if (typeof line_config_index != 'number') {
      console.log('Hexagram::setInnerHexagram expects an integer as arugment 1.')
      return
    }
    if (typeof title_str != 'string') {
      console.log('Hexagram::setInnerHexagram expects a string as argument 2.')
      return
    }

    this.#innermostHexagramIndex = line_config_index
    this.#innermostHexagramTitle = title_str
  }

  addTrigrams(trigrams_arr) {
    if (typeof Trigram != 'function') {
      console.log('Hexagram::addTrigram could not locate a Trigram class definition.')
      return
    }
    if (!Array.isArray(trigrams_arr)) {
      console.log('Hexagram::addTrigram expects an array as an argument.')
      return
    }

    let valid_obj_count = 0
    trigrams_arr.forEach( (trigram_obj) => {
      if (trigram_obj instanceof Trigram) {
        valid_obj_count++
      }
    })
    if (valid_obj_count === trigrams_arr.length) {
      this.#trigrams = trigrams_arr
    } else {
      console.log('Hexagram::addTrigrams expects an array of Trigram objects.')
    }
  }

  getPurportByLine(line_index,line_set) {
    let result = ''

    if (typeof line_index != 'number') {
      console.log('Hexagram::getPurportByLine expects an integer as the first argument.')
      return ''
    }
    if (typeof line_set != 'string') {
      console.log('Hexagram::getPurportByLine expects a string as the second argument.')
      return ''
    }

    if (line_index >= 0 && line_index <= this.#lineConfiguration.length) {

      if (this.#linePurports[line_set]) {

        if (this.#linePurports[line_set][line_index]) {

          result = this.#linePurports[line_set][line_index]

        } else {
          console.log('Hexagram::getPurportByLine was passed an out-of-range line index.')
        }
      } else {
        console.log('Hexagram::getPurportByLine was passed an unrecognized line-set argument.')
      }
    } else {
      console.log('Hexagram::getPurportByLine expects an positive integer no greater than the number of lines as the first argument.')
    }
    return result
  }

  getGeneralPurport(line_set) {
    let result = ''

    if (typeof line_set != 'string') {
      console.log('Hexagram::getGeneralPurport expects a string as an argument.')
      return ''
    }

    if (this.#generalPurports[line_set]) {
      return this.#generalPurports[line_set]
    } else {
      console.log('Hexagram::getGeneralPurport was passed an unrecognized line-set argument.')
      return ''
    }
  }

  getMovingLinesPurports(line_set) {
    let result = null
    if (this.#movingLines.length) {
      result = []
      this.#movingLines.forEach( (moving_line_index) => {
        result.push( this.getPurportByLine(moving_line_index+1,line_set))
      })
    } else {
      console.log('Hexagram::genMovingLinesPurports found no moving lines.')
    }
    return result
  }

  getStillLinesPurport(line_set) {
    let result = ''
    if (!this.#movingLines.length) {
      result = this.getPurportByLine(0,line_set)
    } else {
      console.log('Hexagram::genStillLinesPurports found moving lines.')
    }
    return result
  }
}
