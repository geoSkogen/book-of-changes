class Builder {

  #hexagrams = []
  #trigrams = []
  #lines = [[]]
  #movingLines = []
  #selectedTrigrams = [
    {top: null, bottom: null},{top: null, bottom: null}
  ]

  constructor(first_lines = null,second_lines = null) {
    if (first_lines) {
      first_lines_arr = typeof first_lines === 'string' ? first_lines.split('') : first_lines
      this.setLineArr(first_lines_arr)
    }
    if (second_lines) {
      second_lines_arr = typeof second_lines === 'string' ? second_lines.split('') : second_lines
      this.setLineArr(second_lines_arr)
    }
  }

  get isComplete() {
    return this.#lines[0].length===6 ? true : false
  }

  get hexagrams() {
    return this.#hexagrams
  }

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

  setHexagram(hexagram_obj,index_int) {
    if (typeof Hexagram === 'function') {
      if (hexagram_obj instanceof Hexagram) {
        if (index_int === 0 || index_int === 1) {

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
          console.log('Builder::setHexagram expects in integer 0 or 1 as argument 2.')
        }
      } else {
        console.log('Builder::setHexagram expects a Hexagram object as argument 1. ')
      }
    } else {
      console.log('Builder::setHexagram could not locate a Hexagram class definition.')
    }
  }

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

  toggleHexagram(hexagram,toggle_obj) {
    if (typeof Hexagram === 'function') {
      if (hexagram instanceof Hexagram) {
        if (typeof toggle_obj === 'object' && typeof toggle_obj.hexIndex === 'string') {
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
          console.log('Builder::toggleHexagram expects a toggleObject as argument 2.')
        }
      } else {
        console.log('Builder::toggleHexagram expects a Hexagram object as argument 1.')
      }
    } else {
      console.log('Builder::toggleHexagram could not locate a Hexagram class definition.')
    }
  }

  validateLineArr(lines_arr) {
    let result = null
    if (Array.isArray(lines_arr) && lines_arr.length===6) {
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
    } else {
      console.log('Builder::validateLineArr expects an array of exactly 6 items as an arugment.')
    }
    return result
  }

  setLineArr(line_arr,line_set) {
    if (Array.isArray(line_arr)) {
      let valid_arr = this.validateLineArr(line_arr)
      if (valid_arr) {
        if (line_set === 0 || line_set === 1) {
          this.#lines[line_set] = lines_arr
        } else {
          console.log('Builder::setLineArr expects an integer either 0 or 1 as argument 2.')
        }
      } else {
        console.log('Builder:setLineArr was passed an invalid line array.')
      }
    } else {
      console.log('Builder::setLineArr expects an array as an arugment.')
    }
  }

  getLinesConfig() {
    let line_strings = [
      this.#lines[0].join('')
    ]
    if (this.#lines[1]) {
      line_strings.push(this.#lines[1].join(''))
    }
    return line_strings
  }

  getTrigramsLineConfig(hex_index_int) {
    let result = []
    if (hex_index_int === 0 || hex_index_int === 1) {
      if (this.#selectedTrigrams[hex_index_int].top && this.#selectedTrigrams[hex_index_int].bottom) {
        result = this.#lines[hex_index_int]
      } else if (!this.#selectedTrigrams[hex_index_int].top && this.#selectedTrigrams[hex_index_int].bottom) {
        result = [
          this.#lines[hex_index_int][0],
          this.#lines[hex_index_int][1],
          this.#lines[hex_index_int][2],
          this.#lines[hex_index_int][0],
          this.#lines[hex_index_int][1],
          this.#lines[hex_index_int][2]
        ]
      } else if (this.#selectedTrigrams[hex_index_int].top && !this.#selectedTrigrams[hex_index_int].bottom) {
        result = [
          this.#lines[hex_index_int][3],
          this.#lines[hex_index_int][4],
          this.#lines[hex_index_int][5],
          this.#lines[hex_index_int][3],
          this.#lines[hex_index_int][4],
          this.#lines[hex_index_int][5]
        ]
      } else {
        console.log('Builder::getTrigramsLineConfig - no trigrams have been set, no lines to return.')
      }
    } else {
      console.log('Builder::getTrigramsLineConfig expects an integer of either 1 or 0 as an argument.')
    }
    return result
  }

  getLineConfigByHexIndex(int) {
    if (this.#lines[Number(int)]) {
      return this.#lines[Number(int)].join('')
    }
  }

  setLinesByTrigram(trigram,hex_segment,hex_index) {
    if (typeof Trigram === 'function') {
      if (trigram instanceof Trigram) {
        if (hex_segment === 'top' || hex_segment === 'bottom') {
          if (hex_index === 1 || hex_index === 0) {
            if (trigram.lines.length) {
              let line_index_offset = hex_segment === 'top' ? trigram.lines.length : 0
              this.#lines[hex_index][0 + line_index_offset] = Number(trigram.lines[0])
              this.#lines[hex_index][1 + line_index_offset] = Number(trigram.lines[1])
              this.#lines[hex_index][2 + line_index_offset] = Number(trigram.lines[2])

              if (this.#hexagrams[hex_index]) {
                this.#hexagrams[hex_index] = null
              }

              if (!this.#selectedTrigrams[hex_index][hex_segment]) {
                this.#selectedTrigrams[hex_index][hex_segment] = trigram
              } else {
                console.log('Builder::setLinesByTrigram - a Trigram is already set at hex index ' + hex_index.toString() + ', hex segment ' + hex_segment)
                console.log('Builder::setLinesByTrigram - call Builder::unsetLinesByTrigramIndex(' + hex_segment + ',' + hex_index.toString() + ') to unset it.')
              }
            } else {
              console.log('Builder::setLinesByTrigram could not validate the lines of the Trigram argument.')
            }
          } else {
            console.log('Builder::setLinesByTrigram expects an integer either 0 or 1 as argument 2.')
          }
        } else {
          console.log('Builder::setLinesByTrigram expects a valid hex segment string as argument 3.')
        }
      } else {
        console.log('Builder::setLinesByTrigram expects a Trigram object as argument 1.')
      }
    } else {
      console.log('Builder::setLinesByTrigram could not locate a Trigram class definition.')
    }
  }

  unsetLinesByTrigramIndex(hex_segment,hex_index) {
    if (
      (hex_index === 1 || hex_index === 0)
    )
    {
      let line_index_offset = hex_segment === 'top' ? 3 : 0

      this.#lines[hex_index][0 + line_index_offset] = undefined
      this.#lines[hex_index][1 + line_index_offset] = undefined
      this.#lines[hex_index][2 + line_index_offset] = undefined

      if (this.#hexagrams[hex_index]) {
        this.#hexagrams[hex_index] = null
      }
      this.#selectedTrigrams[hex_index][hex_segment] = null
    } else {
      console.log('Builder::unsetLinesByTrigramIndex expects an integer either 0 or 1 as argument 1.')
    }
  }

  toggleTrigram(trigram,toggle_obj,hex_index) {
    if (typeof Trigram === 'function') {
      if (trigram instanceof Trigram) {
        if (this.#selectedTrigrams[hex_index]) {
          if (typeof toggle_obj === 'object' && typeof toggle_obj.hexSegment === 'string') {
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
            console.log('Builder::toggleTrigram expects a toggleObject as argument 2.')
          }
        } else {
          console.log('Builder::toggleTrigram expects an integer 0 or 1 as argument 3')
        }
      } else {
        console.log('Builder::toggleTrigram expects a Trigram object as argument 1.')
      }
    } else {
      console.log('Builder::toggleTrigram could not locate a Trigram class definition.')
    }
  }

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

  getToggledLineValue(int) {
    return [1,0][int]
  }

  toggleLine(line_index_int,hex_index_int) {
    let toggled_line_val = null
    let result = null
    if (
      typeof line_index_int === 'number' &&
      line_index_int < 6 && line_index_int >= 0
    )
    {
      if (hex_index_int === 1 || hex_index_int === 0) {
        if (this.#lines[hex_index_int][line_index_int]!=undefined) {
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
        } else {
          console.log('Builder::toggleLine was passed a parameter beyond its current line config - line_index: ' + line_index_int)
          console.log('type : ' + typeof line_index_int)
          console.log(this.#lines)
        }
      } else {
        console.log('Builder::toggleLine expects an integer 1 or 0 as argument 2.')
      }
    } else {
      console.log('Builder::updateLine expects a positive integer less than 6 in argument 1.')
    }
    return result
  }

  reset() {
    this.#hexagrams = []
    this.#trigrams = []
    this.#lines = [[]]
    this.#movingLines = []
  }
}
