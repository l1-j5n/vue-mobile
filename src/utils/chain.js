import chain from 'chain-nemo'
import {toast} from 'src/widget/util/currying'
chain.rejected = toast
export default chain
