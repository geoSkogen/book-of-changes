class Builder {

  #hexagrams = []
  #lines = [[]]

  constructor() {

  }

  get isComplete() {
    return this.#lines[0].length === 6 ? true : false
  }

  get getLinesConfig() {
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
          this.#lines[0].push('0')
          if (this.#lines[1]) {
            this.#lines[1].push('0')
          }
          break
        // still line Yang
        case 1 :
          this.#lines[0].push('1')
          if (this.#lines[1]) {
            this.#lines[1].push('1')
          }
          break
        // moving line Yang -> Yin
        case 2 :
          if (this.#lines[1]) {
            this.#lines[1].push('0')
          } else {
            this.#lines[1] = []
            this.#lines[0].forEach( (line_val) => {
              this.#lines[1].push(line_val)
            })
            this.#lines[1].push('0')
          }
          this.#lines[0].push('1')
          break
        // moving line Yin -> Yang
        case 3 :
          if (this.#lines[1]) {
            this.#lines[1].push('1')
          } else {
            this.#lines[1] = []
            this.#lines[0].forEach( (line_val) => {
              this.#lines[1].push(line_val)
            })
            this.#lines[1].push('1')
          }
          this.#lines[0].push('0')
          break
        default :
          console.log('Builder::addLine found an unusable line case index')
      }
      //console.log(this.#lines)
      let last_line_index = this.#lines[0].length
      // return the lines just added, stored on the key of their line index, e.g. { '2' : ['0','1']}
      result[ last_line_index.toString() ] = [ this.#lines[0][last_line_index] ]
      if (this.#lines[1]) {
        result[ last_line_index.toString() ].push(this.#lines[1][last_line_index])
      }
    }
    return result
  }

  updateLine(line_index_int,hex_index_int,line_val_str) {
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
        if (line_val_str instanceof String && (line_val_str==='1' || line_val_str==='0'))
        {

          this.#lines[hex_index_int][line_index_int] = line_val_str
          // return the line just modified, stored on the key of its line index, e.g. { '2' : ['1','']}
          result = {}
          result[line_index_int.toString()] = ['','']
          result[line_index_int.toString()][hex_index_int] = line_val_str
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
