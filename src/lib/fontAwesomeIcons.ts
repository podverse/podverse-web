import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faCut, faEdit, faEllipsisH, faGlobeAmericas, faHistory, faInfinity,
  faLevelDownAlt, faLevelUpAlt, faLink, faListUl, faPause, faPlay, faPlayCircle, faPlus,
  faPlusCircle, faRedoAlt, faSearch, faShare, faSpinner, faStepBackward, faStepForward,
  faTimes, faUndoAlt, faVolumeOff, faVolumeUp, faUserCircle } from '@fortawesome/free-solid-svg-icons'

// Adds FontAwesome icons to the library so they can be used throughout the app
export const addFontAwesomeIcons = () => {
  library.add(
    faCheck,
    faCut,
    faEdit,
    faEllipsisH,
    faGlobeAmericas,
    faHistory,
    faInfinity,
    faLevelDownAlt,
    faLevelUpAlt,
    faLink,
    faListUl,
    faPause,
    faPlay,
    faPlayCircle,
    faPlus,
    faPlusCircle,
    faRedoAlt,
    faSearch,
    faShare,
    faSpinner,
    faStepBackward,
    faStepForward,
    faTimes,
    faUndoAlt,
    faUserCircle,
    faVolumeOff,
    faVolumeUp
  )
}
