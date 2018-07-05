import './icon.less'
import * as icons from './icons'
export default {
  name: 'r-icon',
  props: {
    name: {
      type: String,
      validator (name) {
        return Object.keys(icons).includes(name)
      }
    },
    defaultStyle: Boolean
  },
  render () {
    const {name} = this.$props
    const icon = icons[name]
    return icon ? <img src={icon} name={name} class="r-icon" onClick={event => this.$emit('click', event)}/> : null
  }
}
