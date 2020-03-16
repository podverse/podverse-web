import { library } from '@fortawesome/fontawesome-svg-core'
import { faFacebook, faGithub, faReddit, faTwitter } from '@fortawesome/free-brands-svg-icons'
import {
  faArrowsAltV, faBars, faCaretDown, faCaretRight, faCheck, faCut, faDownload, faEdit,
  faEllipsisH, faFilter, faGlobeAmericas, faHeadphones, faHistory, faInfinity,
  faLevelDownAlt, faLevelUpAlt, faLink, faListUl, faLock, faMobileAlt, faMoon, faPause, faPlay,
  faPlayCircle, faPlus, faPlusCircle, faPodcast, faRedoAlt, faSearch, faShare, faShoppingCart,
  faSmile, faSpinner, faStepBackward, faStepForward, faSun, faTimes, faTools, faTrash, faUndoAlt,
  faUserCircle, faUserSecret, faVolumeOff, faVolumeUp
} from '@fortawesome/free-solid-svg-icons'

// Adds FontAwesome icons to the library so they can be used throughout the app
export const addFontAwesomeIcons = () => {
  library.add(
    faArrowsAltV,
    faBars,
    faCaretDown,
    faCaretRight,
    faCheck,
    faCut,
    faDownload,
    faEdit,
    faEllipsisH,
    faFacebook,
    faFilter,
    faGithub,
    faGlobeAmericas,
    faHeadphones,
    faHistory,
    faInfinity,
    faLevelDownAlt,
    faLevelUpAlt,
    faLink,
    faListUl,
    faLock,
    faMobileAlt,
    faMoon,
    faPause,
    faPlay,
    faPlayCircle,
    faPlus,
    faPlusCircle,
    faPodcast,
    faReddit,
    faRedoAlt,
    faSearch,
    faShare,
    faShoppingCart,
    faSmile,
    faSpinner,
    faStepBackward,
    faStepForward,
    faSun,
    faTimes,
    faTools,
    faTrash,
    faTwitter,
    faUndoAlt,
    faUserCircle,
    faUserSecret,
    faVolumeOff,
    faVolumeUp
  )
}
