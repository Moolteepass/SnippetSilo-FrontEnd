import { useState, useRef, useEffect } from "react"
import { IoOpen } from "react-icons/io5"
import { IoCopy, IoCopyOutline } from "react-icons/io5"
import PropTypes from "prop-types"

const CardTemplate = ({ data, onTitleChange }) => {
  const { Title, URL, ImageURL, Tags } = data
  const [copyIcon, setCopyIcon] = useState(<IoCopy />)
  const [cardTitle, setCardTitle] = useState(Title)

  const textareaRef = useRef(null) // Create a ref to the textarea

  const copyToClipboard = async (title, URL) => {
    await navigator.clipboard.writeText(`${title}: ${URL}`)
    setCopyIcon(<IoCopyOutline />)

    setTimeout(() => {
      setCopyIcon(<IoCopy />) // Revert back to copy icon after 2 seconds
    }, 2000) // Adjusted to 2000 milliseconds for clarity
  }

  const handleChange = (event) => {
    const newTitle = event.target.value
    setCardTitle(newTitle)
    onTitleChange(newTitle) // Call the parent callback here
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto" // Reset height to allow shrinking
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Set height based on scroll height
    }
  }, [cardTitle]) // Run effect whenever cardTitle changes

  return (
    <div className="Ind-Card">
      <div className="Ind-Image-And-Title-Container">
        <div onClick={() => copyToClipboard(Title, URL)}>
          <div className="Ind-Copy">{copyIcon}</div>
        </div>
        <div onClick={() => window.open(URL, "_blank")}>
          <IoOpen className="Ind-Open" />
        </div>
        <div className="Ind-Overlay">
          <img src={ImageURL} alt={`${Title} image`} />
        </div>
        <div className="Ind-Template-Title-Container">
          <textarea
            ref={textareaRef} // Attach the ref
            rows="1" // Start with 1 row
            className="Ind-Template-Title"
            value={cardTitle}
            onChange={handleChange} // Update title on change
          />
        </div>
      </div>
      <div
        className={
          Tags.length > 0 && Tags.some((tag) => tag.trim() !== "")
            ? "Ind-Tags-Container"
            : "Hidden"
        }
      >
        {Tags.filter((tag) => tag.trim() !== "").map((tag) => (
          <span className="Ind-Tags" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

CardTemplate.propTypes = {
  data: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    URL: PropTypes.string.isRequired,
    created: PropTypes.string,
    ImageURL: PropTypes.string,
    Tags: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
  }).isRequired,
  onTitleChange: PropTypes.func.isRequired, // Define the prop type for the callback
}

export default CardTemplate
