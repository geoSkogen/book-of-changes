class Request {

  #windowLocation = {}
  #query = {}

  /**
  * @param Location - window_location
  */
  constructor(window_location) {

    if (typeof window_location != 'object' || !window_location.href) {
      console.log('Request::constructor expects a Window Location object as an argument')
    }
    if (window.location.search) {
      this.transformQueryString(window.location.search)
    }
  }

  transformQueryString(query_string) {
    let get = {}
    query_string.replace('?','').split('&').forEach( (key_val_str) => {
      let key_val_arr = key_val_str.split('=')
      get[key_val_arr[0]] = key_val_arr[1]
    })
    this.#query = get
    return get
  }

  /**
  * Generate second hexagram from the first hexagram and the indices of its moving lines
  * @param string line_config_str
  * @param string moving_lines_arr
  * @return string
  */
  transformLineConfig(line_config_str,moving_lines_str) {
    if (typeof line_config_str != 'string') {
      console.log('Reqeust::transformLineConfig expects a string as argument 1.')
      return ''
    }
    if (typeof moving_lines_str != 'string') {
      console.log('Request::transformLineConfig expects an array as argument 2.')
      return ''
    }

    let result = ''
    let line_toggle_arr = ['1','0']
    result = line_config_str.split('')
    moving_lines_str.split('').forEach( (line_index_str) => {
      if (typeof line_index_str === 'string' && Number(line_index_str) <= 6) {

        let line_index = Number(line_index_str)-1
        result[line_index] = line_toggle_arr[Number(line_config_str[line_index])]

      } else {
        console.log('Request::transformLineConfig was passed an unrecognized moving line argument.')
      }
    })
    return result.join('') != line_config_str ? result.join('') : ''
  }

  /**
  * Generate second hexagram from the first hexagram and the indices of its moving lines
  * @param array hex_bin_arr - book_of_changes raw data, six-character strings consisting of 1 and 0 only
  * @return array - an array of six-character strings consisting of 1 and 0 only
  */
  getHexagramsLinesConfig(hex_bin_arr) {

    if (!this.#query.id) {
      console.log('Request::getHexagramsByLinesConfig requires an ID string query variable.')
      return null
    }

    if (!Array.isArray(hex_bin_arr)) {
      console.log('Request::getHexagramsByLinesConfig expects an array as an argument.')
      return null
    }

    let lines_config = []
    let still_lines_config = ''

    if (/^[10]{6}$/.test(this.#query.id)) {
      lines_config.push(this.#query.id)

    } else if (Number(this.#query.id)) {

      if (hex_bin_arr[Number(this.#query.id)]) {
        lines_config.push(
          hex_bin_arr[Number(this.#query.id)]
        )
      }
    } else {
      console.log('Request::getHexagramsByLinesConfig could not generate a Hexagram ID from the URI.')
      return null
    }

    if (this.#query.moving_lines) {
      still_lines_config = this.transformLineConfig(lines_config[0],this.#query.moving_lines)
      if (still_lines_config) {
        lines_config.push(
          still_lines_config
        )
      } else {
        console.log('Request::getHexagramsByLinesConfig could not generate a line configutation from the moving lines argument.')
      }
    } else {
      lines_config.push(
        lines_config[0]
      )
    }
    return lines_config
  }

  /**
  * @return object
  */
  getHexagramFilter() {
    let response_obj = null
    if (this.#query.id && this.#query.segment) {
      let trigram_id = ( /^[10]{3}$/.test(this.#query.id) ) ?  this.#query.id : Number(this.#query.id)
      let segment = ( ['lower','upper'].indexOf(this.#query.segment) > -1 ) ? this.#query.segment : ''
      response_obj = {
        value : trigram_id,
        action : segment
      }
    } else if (this.#query.subset) {
      response_obj = {
        action : this.#query.subset
      }
    } else {
      console.log('Request::getHexagramsByLinesConfig could not find any valid hexagram filter arguments.')
    }
    return response_obj
  }
}
