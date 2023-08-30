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

  constructor(
    hex_bin_arr,
    tri_bin_arr,
    hex_name_arr,
    tri_names_arr,
    purports_inner,
    purports_outer,
    moving_lines_inner,
    moving_lines_outer,
    hex_lines_chars_arr,
    hex_chars_table,
    tri_lines_chars_arr,
    tri_chars_arr,
    inner_indices,
    sovereign_indices
  )
  {
    this.#hexagramLineConfigurations = hex_bin_arr
    this.#trigramLineConfigurations = tri_bin_arr

    this.#hexagramTitles = hex_name_arr
    this.#generalPurportsInner = purports_inner
    this.#generalPurportsOuter = purports_outer
    this.#linePurportsInner = moving_lines_inner
    this.#linePurportsOuter = moving_lines_outer

    this.#hexagramLineCharacters = hex_lines_chars_arr
    this.#trigramLineCharacters = tri_lines_chars_arr

    this.#innerHexagramIndices = inner_indices
    this.#sovereignHexagramIndices = sovereign_indices

    if (Array.isArray(tri_names_arr)) {
      tri_names_arr.forEach( (table_row) => {
        this.#trigramTitleElements.push(table_row[0])
        this.#trigramQualities.push(table_row[1])
      })
    }

    if (Array.isArray(hex_chars_table)) {
      hex_chars_table.forEach( (table_row) => {
        this.#hexagramCharacters.push(table_row[0])
        this.#hexagramNames.push(table_row[1])
      })
    }

    if (Array.isArray(tri_chars_arr)) {
      tri_chars_arr.forEach( (table_row) => {
        this.#trigramCharacters.push(table_row[0])
        this.#trigramNames.push(table_row[1])
      })
    }
  }

  getHexagramByLineConfig(lookup_arg) {
    let result = null
    if (typeof lookup_arg === 'string' && this.#hexagramLineConfigurations.indexOf(lookup_arg) ) {
      let index = this.#hexagramLineConfigurations.indexOf(lookup_arg)
      result = this.buildHexagram(index)
    } else {
      console.log('Book::getHexagramsByLineConfig was passed an unrecognized argument.')
    }
    return result
  }

  getHexagramsByLinesConfig(lookup_args) {
    let results = []
    if (Array.isArray(lookup_args)) {
      lookup_args.forEach( (lookup_arg) => {
        if (typeof lookup_arg === 'string' && this.#hexagramLineConfigurations.indexOf(lookup_arg) ) {
          let index = this.#hexagramLineConfigurations.indexOf(lookup_arg)
          let hexagram = this.buildHexagram(index)
          if (hexagram) {
            results.push(hexagram)
          }
        } else {
          console.log('Book::getHexagramsByLinesConfig was passed an unrecognized argument.')
          console.log(lookup_arg)
        }
      })
    } else {
      console.log('Book::getHexagramsByLinesConfig expects an array as an argument.')
    }
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

  buildHexagram(lookup_arg) {
    let result = null
    let index = 0
    if (typeof Hexagram === 'function') {

      if (
        Number(lookup_arg) &&
        Number(lookup_arg) > 0 &&
        Number(lookup_arg) < this.#hexagramLineConfigurations.length
      )
      {
        let index = Number(lookup_arg)
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
      } else {
        console.log('Book::buildHexagram was passed an unrecognized string or an integer that is out of range.')
      }
    } else {
      console.log('Book::buildHexagram could not locate the Hexagram class definition.')
    }
    return result
  }

  buildTrigram(lookup_arg) {
    let result = null
    if (typeof lookup_arg === 'string') {
      let lookup_index = this.#trigramLineConfigurations.indexOf(lookup_arg)
      result = new Trigram(
        lookup_arg,
        this.#trigramTitleElements[lookup_index],
        this.#trigramQualities[lookup_index],
        this.#trigramCharacters[lookup_index],
        this.#trigramLineCharacters[lookup_index],
        this.#trigramNames[lookup_index]
      )
    }
    return result
  }


}
