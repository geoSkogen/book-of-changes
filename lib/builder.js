/**
*  Builder maintains the state of Hexagram assembly & mutation where DOM attributes aren't sufficient
*/

class Builder {

  #hexagrams = []
  #trigrams = []
  #lines = [[]]
  #movingLines = []
  #selectedTrigrams = [
    {top: null, bottom: null},{top: null, bottom: null}
  ]

  /**
  * @param string|array
  * @param string|array
  */
  constructor(first_lines = null,second_lines = null) {

    if (first_lines) {
      if (typeof first_lines === 'string') {
        this.setLineArr(first_lines.split(''))
      } else if (Array.isArray(frist_lines)) {
        this.setLineArr(first_lines)
      } else {
        console.log('Builder::constructor was passed an unrecognized line configuration argument 1.')
      }
    }

    if (second_lines) {
      if (typeof second_lines === 'string') {
        this.setLineArr(second_lines.split(''))
      } else if (Array.isArray(second_lines)) {
        this.setLineArr(second_lines)
      } else {
        console.log('Builder::constructor was passed an unrecognized line configuration argument 2.')
      }
    }
  }

  /**
  * @return boolean
  */
  get isComplete() {
    return this.#lines[0].length===6 ? true : false
  }

  /**
  * @return array - array of Hexagram objects
  */
  get hexagrams() {
    return this.#hexagrams
  }

  /**
  * @return array - index numbers of lines in the first hexagrams
  *   which differ from lines of the second hexagram
  */
  get movingLines() {
    let result = []
    for (let i = 0; i < this.#lines[0].length; i++) {
      if (this.#lines[1]) {
        if (this.#lines[0][i] != this.#lines[1][i]) {
          result.push(i)
        }
      }
    }
    return result.length ? result : null
  }

  /**
  * Mutate the Builder's line configuration by passing it a pre-formed Hexagram object
  * @param Hexagram hexagram_obj
  * @param integer index_int - 0 or 1 - referring to the first or second Hexagram position
  * @return void
  */
  setHexagram(hexagram_obj,index_int) {
    if (typeof Hexagram != 'function') {
      console.log('Builder::setHexagram could not locate a Hexagram class definition.')
      return
    }

    if (index_int != 0 && index_int != 1) {
      console.log('Builder::setHexagram expects in integer 0 or 1 as argument 2.')
      return
    }

    if (hexagram_obj instanceof Hexagram) {

      this.#hexagrams[index_int] = hexagram_obj
      this.#lines[index_int] = hexagram_obj.lines.map( (line_val_str) => Number(line_val_str) )

      if (hexagram_obj.movingLines) {
        this.#movingLines = hexagram_obj.movingLines
      }
      // re-synchronize the moving lines
      if (this.#hexagrams[0] && this.#hexagrams[1] ) {
        this.#movingLines = this.getMovingLines
      }

    } else {
      console.log('Builder::setHexagram expects a Hexagram object as argument 1. ')
      return
    }
  }

  /**
  *  Nullify the line configuration and the implied trigrams of a hexagram position
  *    by deleting a pre-set Hexagram object
  *  @param integer
  *  @return void
  */
  unsetHexagram(index_int) {
    if (this.#hexagrams[index_int]) {
      this.#hexagrams[index_int] = null
      this.#lines[index_int] = []
      this.#selectedTrigrams[index_int].top = null
      this.#selectedTrigrams[index_int].bottom = null
    } else {
      console.log('Builder::unsetHexagram was passed an unrecognized hexagram index key.')
    }
  }

  /**
  * Sets or Un-sets a hexagram position based on an array of values.
  * @param Hexagram hexagram
  * @param object toggle_obj - 'toggle' : boolean, 'hexIndex' : integer
  * @return void
  */
  toggleHexagram(hexagram,toggle_obj) {

    if (typeof Hexagram != 'function') {
      console.log('Builder::toggleHexagram could not locate a Hexagram class definition.')
      return
    }
    if (typeof toggle_obj != 'object') {
      console.log('Builder::toggleHexagram expects a an associative array (object) as argument 2.')
      return
    }
    if (typeof toggle_obj.hexIndex != 'string') {
      console.log('Builder::toggleHexagram expects a toggleObject as argument 2.')
      return
    }

    if (hexagram instanceof Hexagram) {

      if (toggle_obj.toggle) {

        if (!this.#hexagrams[toggle_obj.hexIndex]) {
          this.setHexagram(hexagram,Number(toggle_obj.hexIndex))
        } else {
          console.log('Builder::toggleHexagram ' + toggle_obj.hexIndex + ' is already set.')
        }
      } else if (toggle_obj.toggle===false) {

        if (this.#hexagrams[toggle_obj.hexIndex] instanceof Hexagram ) {
          this.unsetHexagram(Number(toggle_obj.hexIndex))
        } else {
          console.log('Builder::toggleHexagram ' + toggle_obj.hexIndex + ' is not set.')
        }
      } else {
        console.log('Builder::toggleHexagram was passed a null toggle value; no toggle will be executed.')
      }
    } else {
      console.log('Builder::toggleHexagram expects a Hexagram object as argument 1.')
    }
  }

  /**
  * Ensures only numeric values of 1 or 0 are assigned to line positions in the Builder's state
  * @param array lines_arr
  * @return array
  */
  validateLineArr(lines_arr) {
    if (!Array.isArray(lines_arr)) {
      console.log('Builder::validateLineArr expects an array as an arugment.')
      return null
    }
    if (lines_arr.length != 6) {
      console.log('Builder::validateLineArr expects an array of exactly 6 items as an arugment.')
      return null
    }

    let result = []
    for (let i = 0; i < lines_arr.length; i++) {
      let line_val = lines_arr[i]
      if (line_val!=0 && line_val!=1) {
        result = null
        break
        console.log('Builder::validateLineArr expects an array of integers either 0 or 1.')
      } else {
        result.push(line_val)
      }
    }
    return result
  }

  /**
  * Creates a line configuration for a designated hexagram position
  * @param array line_arr
  * @param integer line_set_index
  * @return void
  */
  setLineArr(line_arr,line_set_index) {
    if (!Array.isArray(line_arr)) {
      console.log('Builder::setLineArr expects an array as an arugment.')
      return
    }
    // Ensure the input array consists of 1 and 0 numeric values only
    let valid_arr = this.validateLineArr(line_arr)
    if (valid_arr) {
      if (line_set_index === 0 || line_set_index === 1) {
        // Add the line configuration
        this.#lines[line_set_index] = lines_arr
        if (this.#hexagrams[line_set_index]) {
          this.#hexagrams[line_set_index] = null
        }
      } else {
        console.log('Builder::setLineArr expects an integer either 0 or 1 as argument 2.')
      }
    } else {
      console.log('Builder:setLineArr was passed an invalid line array.')
    }
  }

  /**
  * For consumption by Book of Changes to look up created or mutated hexagram configurations
  * @return array - two strings consisting only of the characters 1 and 0
  */
  getLinesConfig() {
    let line_strings = [
      this.#lines[0].join('')
    ]
    if (this.#lines[1]) {
      line_strings.push(this.#lines[1].join(''))
    }
    return line_strings
  }

  /**
  * For consumption by Book of Changes to look up a created or mutated hexagram configuration
  * @param integer|numeric-string int
  * @return string - consisting only of the characters 1 and 0
  */
  getLineConfigByHexIndex(int) {
    if (this.#lines[Number(int)]) {
      return this.#lines[Number(int)].join('')
    }
  }

  /**
  * Generate second hexagram from the first hexagram and the indices of its moving lines
  * @param string line_config_str
  * @param array moving_lines_arr
  * @return string
  */
  getNewLineConfigByMovingLines(line_config_str,moving_lines_arr) {
    if (typeof line_config_str != 'string') {
      console.log('Builder::getNewLineConfigByMovingLines expects a string as argument 1.')
      return ''
    }
    if (!Array.isArray(moving_lines_arr)) {
      console.log('Builder::getNewLineConfigByMovingLines expects an array as argument 2.')
      return ''
    }
    if (line_config_str.length != 6) {
      console.log('Builder::getNewLineConfigByMovingLines expects a string of six characters as argument 1.')
    }

    let result = ''
    let line_toggle_arr = ['1','0']
    result = line_config_str.split('')
    moving_lines_arr.forEach( (line_index_str) => {
      if (typeof line_index_str === 'string' && Number(line_index_str) <= 6) {

        let line_index = Number(line_index_str)-1
        result[line_index] = line_toggle_arr[Number(line_config_str[line_index])]

      } else {
        console.log('Builder::getNewLineConfigByMovingLines was passed an unrecognized moving line argument.')
      }
    })
    return result.join('')
  }

  /**
  * Get the line configuration of a single hexagram based on how
  *   the Builder's Trigrams have been set.  If only one Trigram is set,
  *   it will be duplicated to create a full hexagram line configuration.
  * @param integer hex_index_int
  * @return array - six integers either 0 or 1
  */
  getTrigramsLineConfig(hex_index_int) {
    let result = []
    if (hex_index_int === 0 || hex_index_int === 1) {

      if (this.#selectedTrigrams[hex_index_int].top && this.#selectedTrigrams[hex_index_int].bottom) {

        result = this.#selectedTrigrams[hex_index_int].bottom.lines.concat(this.#selectedTrigrams[hex_index_int].top.lines)

      } else if (!this.#selectedTrigrams[hex_index_int].top && this.#selectedTrigrams[hex_index_int].bottom) {

        result = this.#selectedTrigrams[hex_index_int].bottom.lines.concat(this.#selectedTrigrams[hex_index_int].bottom.lines)

      } else if (this.#selectedTrigrams[hex_index_int].top && !this.#selectedTrigrams[hex_index_int].bottom) {

        result = this.#selectedTrigrams[hex_index_int].top.lines.concat(this.#selectedTrigrams[hex_index_int].top.lines)

      } else {
        console.log('Builder::getTrigramsLineConfig - no trigrams have been set, no lines to return.')
      }
    } else {
      console.log('Builder::getTrigramsLineConfig expects an integer of either 1 or 0 as an argument.')
    }
    return result
  }

  /**
  * Sets three lines at a time and sets a Trigram, does not overwrite an existing Trigram
  * @param Trigram trigram
  * @param string hex_segment - 'bottom' or 'top' referring to the first or last half of the array
  * @param integer hex_index
  * @return void
  */
  setLinesByTrigram(trigram,hex_segment,hex_index) {

    if (typeof Trigram != 'function') {
      console.log('Builder::setLinesByTrigram could not locate a Trigram class definition.')
      return
    }
    if (typeof hex_segment != 'string' || (hex_segment != 'top' && hex_segment != 'bottom')) {
      console.log('Builder::setLinesByTrigram expects a valid hex segment as argument 2.')
      return
    }
    if (typeof hex_index != 'number' || (hex_index != 1 && hex_index != 0)) {
      console.log('Builder::setLinesByTrigram expects an integer either 0 or 1 as argument 2.')
      return
    }
    if (this.#selectedTrigrams[hex_index][hex_segment]) {
      console.log('Builder::setLinesByTrigram - a Trigram is already set at hex index ' + hex_index.toString() + ', hex segment ' + hex_segment)
      console.log('Builder::setLinesByTrigram - call Builder::unsetLinesByTrigramIndex(' + hex_segment + ',' + hex_index.toString() + ') to unset it.')
      return
    }

    if (trigram instanceof Trigram) {

      if (trigram.lines.length) {
        let line_index_offset = hex_segment==='top' ? trigram.lines.length : 0
        this.#lines[hex_index][0 + line_index_offset] = Number(trigram.lines[0])
        this.#lines[hex_index][1 + line_index_offset] = Number(trigram.lines[1])
        this.#lines[hex_index][2 + line_index_offset] = Number(trigram.lines[2])

        if (this.#hexagrams[hex_index]) {
          this.#hexagrams[hex_index] = null
        }

        this.#selectedTrigrams[hex_index][hex_segment] = trigram
        //
      } else {
        console.log('Builder::setLinesByTrigram could not validate the lines of the Trigram argument.')
      }
    }
  }

  /**
  * Un-sets three lines at a time and deletes a Trigram
  * @param Trigram trigram
  * @param string hex_segment - 'bottom' or 'top' referring to the first or last half of the array
  * @param integer hex_index
  * @return void
  */
  unsetLinesByTrigramIndex(hex_segment,hex_index) {

    if (typeof hex_index != 'number' || (hex_index != 1 && hex_index != 0)) {
      console.log('Builder::unsetLinesByTrigramIndex expects an integer either 0 or 1 as argument 1.')
      return
    }
    if (typeof hex_segment != 'string' || (hex_segment != 'top' && hex_segment != 'bottom')) {
      console.log('Builder::unsetLinesByTrigram expects a valid hex segment as argument 2.')
      return
    }

    if (!this.#selectedTrigrams[hex_index][hex_segment]) {
      console.log('Builder::unsetLinesByTrigram did not find a trigram at the specified index.')
      return
    }

    let line_index_offset = hex_segment === 'top' ? 3 : 0
    if (
      this.#lines[hex_index][0 + line_index_offset] === Number(this.#selectedTrigrams[hex_index][hex_segment].lines[0]) &&
      this.#lines[hex_index][1 + line_index_offset] === Number(this.#selectedTrigrams[hex_index][hex_segment].lines[1]) &&
      this.#lines[hex_index][2 + line_index_offset] === Number(this.#selectedTrigrams[hex_index][hex_segment].lines[2])
    )
    {
      this.#lines[hex_index][0 + line_index_offset] = undefined
      this.#lines[hex_index][1 + line_index_offset] = undefined
      this.#lines[hex_index][2 + line_index_offset] = undefined

      if (this.#hexagrams[hex_index]) {
        this.#hexagrams[hex_index] = null
      }
    } else {
      console.log('Builder::unsetLinesByTrigramIndex found the line configuration different from the trigram configutation. Trigram will be unset; lines will not.')
    }

    this.#selectedTrigrams[hex_index][hex_segment] = null
  }

  /**
  * Sets or Un-sets a trigram position based on an array of values.
  * @param Trigram hexagram
  * @param object toggle_obj - 'toggle' : boolean, 'hexSegment' : string ("top"|"bottom")
  * @return void
  */
  toggleTrigram(trigram,toggle_obj,hex_index) {

    if (typeof Trigram != 'function') {
      console.log('Builder::toggleTrigram could not locate a Trigram class definition.')
      return
    }
    if (typeof toggle_obj != 'object' && typeof toggle_obj.hexSegment != 'string') {
      console.log('Builder::toggleTrigram expects a toggleObject as argument 2.')
      return
    }
    if (typeof hex_index != 'number' || (hex_index != 1 && hex_index != 0)) {
      console.log('Builder::setLinesByTrigram expects an integer either 0 or 1 as argument 3.')
      return
    }

    if (trigram instanceof Trigram) {

      if (toggle_obj.toggle) {
        if (!this.#selectedTrigrams[hex_index][toggle_obj.hexSegment]) {
          this.setLinesByTrigram(trigram,toggle_obj.hexSegment,hex_index)
        } else {
          console.log('Builder::toggleTrigram ' + toggle_obj.hexSegment + ' on hex index ' + hex_index.toString() + ' is already set.')
        }
      } else if (toggle_obj.toggle===false) {
        if (this.#selectedTrigrams[hex_index][toggle_obj.hexSegment] instanceof Trigram ) {
          this.unsetLinesByTrigramIndex(toggle_obj.hexSegment,hex_index)
        } else {
          console.log('Builder::toggleTrigram ' + toggle_obj.hexSegment + ' on hex index ' + hex_index.toString() + ' is not set.')
        }
      } else {
        console.log('Builder::toggleTrigram was passed a null toggle value; no toggle will be executed.')
      }
    } else {
      console.log('Builder::toggleTrigram expects a Trigram object as argument 1.')
    }
  }

  /**
  * Generate a random line.  If the random generation implies a moving line,
  *   generate its opposite line for a second hexagram. If no second hexagram
  *   exists, generate a copy the previously generated lines of the first hexagram
  *   and add the new line.
  * @return object - lineIndex: integer, hexIndex: integer, lineVal: integer
  */
  addLine() {
    let result = {}
    if (this.isComplete) {
      console.log("Builder::addLine - the line configurations are complete")
      result =  null
    } else {
      let moving_lines = this.movingLines
      let line_case_index = Math.floor(Math.random()*4)

      switch(line_case_index) {
        // still line Yin
        case 0 :
          this.#lines[0].push(0)
          if (this.#lines[1]) {
            this.#lines[1].push(0)
          }
          break
        // still line Yang
        case 1 :
          this.#lines[0].push(1)
          if (this.#lines[1]) {
            this.#lines[1].push(1)
          }
          break
        // moving line Yang -> Yin
        case 2 :
          if (this.#lines[1]) {
            this.#lines[1].push(0)
          } else {
            this.#lines[1] = []
            this.#lines[0].forEach( (line_val) => {
              this.#lines[1].push(line_val)
            })
            this.#lines[1].push(0)
          }
          this.#lines[0].push(1)
          break
        // moving line Yin -> Yang
        case 3 :
          if (this.#lines[1]) {
            this.#lines[1].push(1)
          } else {
            this.#lines[1] = []
            this.#lines[0].forEach( (line_val) => {
              this.#lines[1].push(line_val)
            })
            this.#lines[1].push(1)
          }
          this.#lines[0].push(0)
          break
        default :
          console.log('Builder::addLine found an unusable line case index')
      }
      let last_line_index = this.#lines[0].length-1
      // return an associative array for each line just added
      result = [{
        lineIndex : last_line_index,
        hexIndex : 0,
        lineVal : this.#lines[0][last_line_index].toString()
      }]
      if (this.#lines[1]) {
        result[1] = {
          lineIndex : last_line_index,
          hexIndex : 1,
          lineVal : this.#lines[1][last_line_index].toString()
        }
        // return the backlog of lines on array 1 if this is just the start of array 2
        if (
          (this.#lines[1][last_line_index] != this.#lines[0][last_line_index]) &&
          !moving_lines
        )
        {
          result.firstMovingLine = true
          result.firstHexPreviousLines = this.#lines[0].slice(0,last_line_index)
        }
      }
    }
    return result
  }

  /**
  * Generate the value of a moving line
  * @param integer
  * @return array
  */
  getToggledLineValue(int) {
    return [1,0][int]
  }

  /**
  * Mutate the state of Builder's line configuration by changing one line
  * @param integer line_index_int
  * @param integer hex_index_int
  * @return object - lineIndex: integer, hexIndex: integer, lineVal: integer
  */
  toggleLine(line_index_int,hex_index_int) {
    let toggled_line_val = null
    let result = null

    if ( typeof line_index_int != 'number' && line_index_int > 5 && line_index_int < 0 ) {
      console.log('Builder::updateLine expects a positive integer less than 6 in argument 1.')
      return null
    }
    if (typeof hex_index_int != 'number' || hex_index_int != 1 && hex_index_int != 0) {
      console.log('Builder::toggleLine expects an integer 1 or 0 as argument 2.')
      return null
    }
    if (this.#lines[hex_index_int][line_index_int]==undefined) {
      console.log('Builder::toggleLine was passed a parameter beyond its current line config - line_index: ' + line_index_int)
      console.log('type : ' + typeof line_index_int)
      console.log(this.#lines)
      return null
    }

    toggled_line_val = this.getToggledLineValue(
      this.#lines[hex_index_int][line_index_int]
    )
    if (toggled_line_val!=undefined) {
      this.#lines[hex_index_int][line_index_int] = toggled_line_val
      // return the fields for line just modified
      result = {
        lineIndex : line_index_int,
        hexIndex : hex_index_int,
        lineVal : toggled_line_val
      }
      // invalidate the hexagram associated with the former configuration
      if (this.#hexagrams[hex_index_int]) {
        this.#hexagrams[hex_index_int] = null
        this.#movingLines = []
      }
    } else {
      console.log('Builder::toggleLine could not toggle an unrecognized value.')
    }
    return result
  }

  /**
  * Nullify all configuration
  */
  reset() {
    this.#hexagrams = []
    this.#trigrams = []
    this.#lines = [[]]
    this.#movingLines = []
  }
}
