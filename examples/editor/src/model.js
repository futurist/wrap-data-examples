import {makeModel} from './util'
import userData from './model/user'

const data = {}
userData(data)
const model = makeModel(data);

window.model = model;
export default model;
