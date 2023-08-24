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
        this.#hexagramCharacters.push(table_row[0])
        this.#hexagramNames.push(table_row[1])
      })
    }
  }

  getHexagramByLineConfig(lookup_arg) {
    let result = null
    if (lookup_arg instanceof String && this.#hexagramLineConfigurations.indexOf(lookup_arg) ) {
      let index = this.#hexagramLineConfigurations.indexOf(lookup_arg)
      result = this.buildHexagram(index)
    } else {
      console.log('Book::getHexagramsByLineConfig was passed an unrecognized argument.')
    }
    return result
  }

  getHexagramsByLinesConfig(lookup_args) {
    console.log(lookup_args)
    let results = []
    if (Array.isArray(lookup_args)) {
      lookup_args.forEach( (lookup_arg) => {
        if (lookup_arg instanceof String && this.#hexagramLineConfigurations.indexOf(lookup_arg) ) {
          let index = this.#hexagramLineConfigurations.indexOf(lookup_arg)
          results.push( this.buildHexagram(index))
        } else {
          console.log(this.#hexagramLineConfigurations.indexOf(lookup_arg))
          console.log('Book::getHexagramsByLinesConfig was passed an unrecognized argument.')
        }
      })
    } else {
      console.log('Book::getHexagramsByLinesConfig expects an array as an argument.')
    }
    return results.length ? results : null
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
      } else {
        console.log('Book::buildHexagram was passed an unrecognized string or an integer that is out of range.')
      }
    } else {
      console.log('Book::buildHexagram could not locate the Hexagram class definition.')
    }
    return result
  }



}
