class Book {

  #hexagramLineConfigurations = []
  #trigramLineConfigurations = []

  #hexagramTitles = []
  #generalPurportsInner = []
  #generalPurportsOuter = []
  #linePurportsInner = []
  #linePurportsOuter = []

  #hexagramLineCharacters = []
  #hexagramCharacters = []
  #hexagramNames = []

  #trigramTitleElements = []
  #trigramQualities = []
  #trigramLineCharacters = []
  #trigramCharacters = []
  #trigramNames = []

  #innerHexagramIndices = []
  #sovereignHexagramIndices = []

  /**
  * @param object library - associative array - basic info for each hexagram
  * @param object typeface - associative array - characters used in I Ching
  */
  constructor(library,typeface) {
    this.#hexagramLineConfigurations = library.hex_bin_arr
    this.#trigramLineConfigurations = library.tri_bin_arr

    this.#hexagramTitles = library.hex_name_arr
    this.#generalPurportsInner = library.purports_inner
    this.#generalPurportsOuter = library.purports_outer
    this.#linePurportsInner = library.moving_lines_inner
    this.#linePurportsOuter = library.moving_lines_outer

    this.#hexagramLineCharacters = typeface.hex_lines_chars_arr
    this.#trigramLineCharacters = typeface.tri_lines_chars_arr

    this.#innerHexagramIndices = library.inner_indices
    this.#sovereignHexagramIndices = library.sovereign_indices

    if (Array.isArray(library.tri_names_arr)) {
      library.tri_names_arr.forEach( (table_row) => {
        this.#trigramTitleElements.push(table_row[0])
        this.#trigramQualities.push(table_row[1])
      })
    }

    if (Array.isArray(typeface.hex_chars_table)) {
      typeface.hex_chars_table.forEach( (table_row) => {
        this.#hexagramCharacters.push(table_row[0])
        this.#hexagramNames.push(table_row[1])
      })
    }

    if (Array.isArray(typeface.tri_chars_arr)) {
      typeface.tri_chars_arr.forEach( (table_row) => {
        this.#trigramCharacters.push(table_row[1])
        this.#trigramNames.push(table_row[0])
      })
    }
  }

  /**
  * Get a single Hexagram object from its line configuration
  * @param string lookup_arg - six-characters and consists of either 1 or 0
  * @return Hexagram
  */
  getHexagramByLineConfig(lookup_arg) {
    let result = null
    if (typeof lookup_arg === 'string' && this.#hexagramLineConfigurations.indexOf(lookup_arg) ) {
      let index = this.#hexagramLineConfigurations.indexOf(lookup_arg)
      result = this.buildHexagram(index)
    } else {
      console.log('Book::getHexagramByLineConfig was passed an unrecognized argument.')
    }
    return result
  }

  /**
  * Get a two Hexagram objects from two line configurations.
  *   The first Hexagram's moving lines can be inferred from the line
  *   configuration of the second Hexagram.
  * @param array lookup_args - arrays of six-character strings consisting of either 1 or 0
  * @return array [Hexagram,Hexagram]
  */
  getHexagramsByLinesConfig(lookup_args) {
    let results = []

    if (!Array.isArray(lookup_args)) {
      console.log('Book::getHexagramsByLinesConfig expects an array as an argument.')
      return results
    }

    lookup_args.forEach( (lookup_arg) => {
      if (typeof lookup_arg === 'string' && this.#hexagramLineConfigurations.indexOf(lookup_arg) ) {
        let index = this.#hexagramLineConfigurations.indexOf(lookup_arg)
        let hexagram = this.buildHexagram(index)
        if (hexagram) {
          results.push(hexagram)
        }
      } else {
        console.log('Book::getHexagramsByLinesConfig was passed an unrecognized argument.')
      }
    })

    if (results[0] && results[1]) {
      let moving_lines = []
      for (let i = 0; i < results[0].lines.length; i++) {
        if (results[0].lines[i] != results[1].lines[i]) {
          moving_lines.push(i)
        }
      }
      results[0].setMovingLines(moving_lines)
    }
    return results
  }

  /**
  * @param integer index
  * @return string
  */
  getLineConfigByHexagramNumber(index) {
    let result = ''
    if (Number(index) && !(Number(index) > this.#hexagramLineConfigurations.length)) {
      if (this.#hexagramLineConfigurations[index]) {
        result = this.#hexagramLineConfigurations[index]
      }
    }
    return result
  }

  /**
  * @param string lookup_arg
  * @return Hexagram
  */
  buildHexagram(lookup_arg) {

    if (typeof Hexagram != 'function') {
      console.log('Book::buildHexagram could not locate the Hexagram class definition.')
      return null
    }

    if (typeof lookup_arg != 'number' || !Number(lookup_arg)) {
      console.log('Book::buildHexagram expects an integer or numeric string as an argument.')
      return null
    }

    let result = null
    let index = Number(lookup_arg)

    if (index <= 0 && index >= this.#hexagramLineConfigurations.length) {
      console.log('Book::buildHexagram was passed an numeric string or integer that is out of range.')
      return null
    }

    let is_sovereign = (this.#sovereignHexagramIndices.indexOf(index) > -1) ? true : false
    let is_inner = (this.#innerHexagramIndices.indexOf(index) > -1) ? true : false

    result = new Hexagram(
      index,
      this.#hexagramLineConfigurations[index],
      this.#hexagramTitles[index],
      this.#generalPurportsInner[index],
      this.#generalPurportsOuter[index],
      this.#linePurportsInner[index],
      this.#linePurportsOuter[index],
      this.#hexagramNames[index],
      this.#hexagramCharacters[index],
      this.#hexagramLineCharacters[index],
      is_inner,
      is_sovereign
    )

    result.setInnerHexagram(
      this.#hexagramLineConfigurations.indexOf(result.innerLines),
      this.#hexagramNames[
        this.#hexagramLineConfigurations.indexOf(result.innerLines)
      ]
    )
    result.setInnermostHexagram(
      this.#hexagramLineConfigurations.indexOf(result.innermostLines),
      this.#hexagramNames[
        this.#hexagramLineConfigurations.indexOf(result.innermostLines)
      ]
    )

    if (typeof Trigram === 'function') {
      result.addTrigrams(
        [
          this.buildTrigram(result.trigramLines[0]),
          this.buildTrigram(result.trigramLines[1])
        ]
      )
    } else {
      console.log('Book::buildHexagram could not locate the Trigram class definition.')
    }

    return result
  }

  /**
  * @param string lookup_arg
  * @return Trigram
  */
  buildTrigram(lookup_arg) {
    let result = null

    if (typeof lookup_arg!= 'string') {
      console.log('Book:buildTrigram expects a string as an argument.')
      return null
    }

    let lookup_index = this.#trigramLineConfigurations.indexOf(lookup_arg)
    result = new Trigram(
      lookup_index+1,
      lookup_arg,
      this.#trigramTitleElements[lookup_index],
      this.#trigramQualities[lookup_index],
      this.#trigramCharacters[lookup_index],
      this.#trigramLineCharacters[lookup_index],
      this.#trigramNames[lookup_index]
    )

    return result
  }

  /**
  * @param array - [Trigram,Trigram]
  * @return Hexagram
  */
  getHexagramFromTrigrams(trigrams) {
    let line_config_str = ''
    let result = null

    if (typeof Trigram != 'function') {
      console.log('Book::getHexagramFromTrigrams could not locate the Trigram class definition.')
      return null
    }

    if (!Array.isArray(trigrams) || trigrams.length != 2) {
      console.log('Book::getHexagramFromTrigrams exepcts an array as an argument.')
      return null
    }

    trigram.forEach( (trigram) => {
      if (trigram instanceof Trigram) {
        line_config_str += trigram.lines.join('')
      } else {
        console.log('Book::getHexagramFromTrigrams expects Trigrams as array elements.')
      }
    })

    if (line_config_str.length) {
      result = this.buildHexagram(
        this.#hexagramLineConfigurations.indexOf(line_config_str)
      )
    }

    return result
  }

  /**
  * @return array - of Hexagram objects
  */
  getHexagramsAll() {
    let result = []
    this.#hexagramLineConfigurations.forEach( (line_config_str,i) => {
      if (i) {
        let hexagram = this.buildHexagram(i)
        if (hexagram) {
          result.push(hexagram)
        } else {
          console.log('Book::getHexagramsAll got a null value from the found hexagram index.')
        }
      }
    })
    return result
  }

  /**
  * @return array - of Trigram ojects
  */
  getTrigramsAll() {
    let result = []
    this.#trigramLineConfigurations.forEach( (line_config_str) => {
      let trigram = this.buildTrigram(line_config_str)
      if (trigram) {
        result.push(trigram)
      } else {
        console.log('Book::getTrigramsAll got a null value from the found configuration string.')
      }
    })
    return result
  }

  /**
  * Return all Hexagram objects that have a specified trigram configuration in a
  *  specified segment of their hexagram configuration
  * @param string trigram_id
  * @param integer trigram_half_int
  * @return array - of Hexagram objects
  */
  getHexagramsByTrigram(trigram_id,trigram_half_int) {
    const result = []
    let trigram_line_config_str = ''

    if (typeof trigram_half_int != 'number') {
      console.log('Book::getHexagramsByTrigram expects an integer as argument 2.')
      return result
    }

    if (trigram_half_int != 1 && trigram_half_int != 0) {
      console.log('Book::getHexagramsByTrigram expects an integer 0 or 1 as argument 2.')
      return result
    }

    if (typeof trigram_id === 'number') {
      if (this.#trigramLineConfigurations[trigram_id]) {
        trigram_line_config_str = this.#trigramLineConfigurations[trigram_id]
      }
    } else if (typeof trigram_id === 'string') {
      if (this.#trigramLineConfigurations.indexOf(trigram_id)>-1) {
        trigram_line_config_str = trigram_id
      }
    } else {
      return result
      console.log('Book::getHexagramsByTrigram expects a string or number as argument 1.')
    }

    if (trigram_line_config_str) {
      this.#hexagramLineConfigurations.forEach( (hexagram_line_config_str,i) => {
        if (i) {
          let trigram_hex_half_str = ''
          if (trigram_half_int) {
            trigram_hex_half_str = hexagram_line_config_str.slice(
              trigram_line_config_str.length,
              hexagram_line_config_str.length
            )
          } else {
            trigram_hex_half_str = hexagram_line_config_str.slice(
              0,
              trigram_line_config_str.length
            )
          }
          if (trigram_hex_half_str === trigram_line_config_str) {

            let hexagram = this.buildHexagram(i)
            if (hexagram) {
              result.push(hexagram)
            } else {
              console.log('Book::getHexagramsByTrigram got a null value from the found hexagram index.')
            }
          }
        }
      })
    } else {
      console.log('Book::getHexagramsByTrigram was passed an unrecognized trigram ID; use an integer 0-7 as an index or a three-charcter string of 1 or 0 as a literal.')
    }
    return result
  }

  /**
  * @return array - of Hexagram objects
  */
  getInnerHexagrams() {
    let result = []
    this.#innerHexagramIndices.forEach( (inner_hex_index) => {
      let hexagram = this.buildHexagram(inner_hex_index)
      if (hexagram) {
        result.push(hexagram)
      } else {
        console.log('Book::getInnerHexagrams got a null value from the found hexagram index.')
      }
    })
    return result
  }

  /**
  * @return array - of Hexagram objects
  */
  getSovereignHexagrams() {
    let result = []
    this.#sovereignHexagramIndices.forEach( (sov_hex_index) => {
      let hexagram = this.buildHexagram(sov_hex_index)
      if (hexagram) {
        result.push(hexagram)
      } else {
        console.log('Book::getSovereignHexagrams got a null value from the found hexagram index.')
      }
    })
    return result
  }

  /**
  * @return array - of Hexagram objects
  */
  getInnermostHexagrams() {
    return [
      this.buildHexagram(1),
      this.buildHexagram(2),
      this.buildHexagram(63),
      this.buildHexagram(64)
    ]
  }
}
