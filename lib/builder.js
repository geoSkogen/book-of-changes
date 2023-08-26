class Builder {

  #hexagrams = []
  #lines = [[]]

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

  addLine() {
    let result = {}
    if (this.isComplete) {
      console.log("Builder::addLine - the line configurations are complete")
      result =  null
    } else {
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
      }
    }
    return result
  }

  updateLine(line_index_int,hex_index_int,line_val_int) {
    let result = null
    if (
      (Number(line_index_int) || Number(line_index_int)===0 ) &&
      Number(line_index_int) < 6
    )
    {
      if (
        (Number(hex_index_int) || Number(hex_index_int)===0) &&
         Number(hex_index_int) < 2
      )
      {
        if (line_val_int===1 || line_val_int===0) {

          this.#lines[hex_index_int][line_index_int] = line_val_int
          // return the line just modified, stored on the key of its line index, e.g. { '2' : [1,'']}
          result = {
            lineIndex : line_index_int,
            lineVals : []
          }
          result.lineVals[hex_index_int] = line_val_int

        } else {
          console.log('Builder::updateLine was passed an invalid line value in argument 3.')
        }
      } else {
        console.log('Builder::updateLine was passed an invalid hex index in argument 2.')
      }
    } else {
      console.log('Builder::updateLine was passed an invalid line index in argument 1.')
    }
    return result
  }
}
