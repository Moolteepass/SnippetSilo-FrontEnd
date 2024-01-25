import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faWandMagicSparkles,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import MagicForm from "./MagicForm"
import ManualForm from "./ManualForm"

const Modal = () => {
  const [activeForm, setActiveForm] = useState(null)

  const showMagicForm = () => setActiveForm("magic")
  const showManualForm = () => setActiveForm("manual")

  return (
    <div>
      <div className="modalButtons">
        <button className="magicSearch" onClick={showMagicForm}>
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </button>
        <button className="manualSearch" onClick={showManualForm}>
          <FontAwesomeIcon icon={faScrewdriverWrench} />
        </button>
      </div>

      {activeForm === "magic" && <MagicForm />}
      {activeForm === "manual" && <ManualForm />}
    </div>
  )
}

export default Modal
