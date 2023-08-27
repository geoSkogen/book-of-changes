class Builder {

  #hexagrams = []
  #lines = [[]]
  #movingLines = []

  constructor(first_lines = null,second_lines = null) {
    if (first_lines) {
      first_lines_arr = typeof first_lines === 'string' ? first_lines.split('') : first_lines
      this.validateLineArr(first_lines_arr)
    }
    if (second_lines) {
      second_lines_arr = typeof second_lines === 'string' ? second_lines.split('') : second_lines
      this.validateLineArr(second_lines_arr)
    }
  }

  get isComplete() {
    return this.#lines[0].length === 6 ? true : false
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
    if (hexagram_obj instanceof Hexagram) {
      if (index_int === 0 || index_int === 1) {
        this.#hexagrams[index_int] = hexagram_obj
      } else {
        console.log('Builder::setHexagram expects in interger 0 or 1 as argument 2.')
      }
    } else {
      console.log('Builder::setHexagram expects a Hexagram object as argument 1. ')
    }
  }

  validateLineArr(lines_arr,line_set) {
    if (Array.isArray(lines_arr) && lines_arr.length===6) {
      let valid_arr = true
      let valid_lines_arr = []
      for (let i = 0; i < lines_arr.length; i++) {

        let line_val = lines_arr[i]
        if (line_val===0 || line_val===1) {

          valid_lines_arr.push(line_val)

        } else {
          valid_arr = false
          break
          console.log('Builder::validateLinesArr expects an array of integers either 0 or 1.')
        }
      }

      if (valid_arr) {
        if (line_set === 0 || line_set === 1) {
          this.#lines[line_set] = valid_lines_arr
        } else {
          console.log('Builder::validateLinesArr expects an integer either 0 or 1 as argument 2.')
        }
      } else {
        console.log('Builder:validateLinesArr was passed an invalid line value.')
      }
    } else {
      console.log('Builder::validateLinesArr expects an array of exactly 6 items or six-character string as arugment.')
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


  getLineConfigByHexIndex(int) {
    if (this.#lines[Number(int)]) {
      return this.#lines[Number(int)].join('')
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
      // return the lines just added, with the key of their line index
      result = {
        lineIndex : last_line_index,
        lineVals : [
          this.#lines[0][last_line_index].toString()
        ]
      }
      if (this.#lines[1]) {
        result.lineVals.push(this.#lines[1][last_line_index].toString())
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

  updateLine(line_index_int,hex_index_int,line_val_int) {
    let result = null
    if (
      typeof line_index_int === 'number' &&
      line_index_int < 6 && line_index_int >= 0
    )
    {
      if (
        (typeof hex_index_int === 'number '&& (line_val_int===1 || line_val_int===0) )
      )
      {
        if (this.#lines[hex_index_int][line_index_int]) {
          this.#lines[hex_index_int][line_index_int] = line_val_int
          // return the line just modified, stored on the key of its line index, e.g. { '2' : [1,'']}
          result = {
            lineIndex : line_index_int,
            hexIndex : hex_index_int,
            lineVal : line_val_int
          }
        } else {
          console.log('Builder::updateLine was passed a parameter beyond its current line config.')
        }
      } else {
        console.log('Builder::updateLine expects a 1 or 0 as argument 2.')
      }
    } else {
      console.log('Builder::updateLine expects a positive integer less than 6 in argument 1.')
    }
    return result
  }
}