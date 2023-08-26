class Builder {

  #hexagrams = []
  #lines = [[]]
  #movingLines = []

  constructor() {

  }

  get isComplete() {
    return this.#lines[0].length === 6 ? true : false
  }

  getLinesConfig() {
    let line_strings = [
      this.#lines[0].join('')
    ]
    if (this.#lines[1]) {
      line_strings.push(this.#lines[1].join(''))
    }
    //console.log(line_strings)
    return line_strings
  }


  getLineConfigByHexIndex(int) {
    if (this.#lines[Number(int)]) {
      return this.#lines[Number(int)].join('')
    }
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

  addLine() {
    let result = {}
    if (this.isComplete) {
      console.log("Builder::addLine - the line configurations are complete")
      result =  null
    } else {
      let moving_lines = this.movingLines
      let line_case_index = Math.floor(Math.random()*4)
      //console.log(line_case_index)
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
    console.log(result)
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
