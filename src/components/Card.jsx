import { useState } from "react"
import { IoOpen } from "react-icons/io5"
import { IoCopy, IoCopyOutline } from "react-icons/io5"
import PropTypes from "prop-types"

const Card = ({ data }) => {
  const { Title, URL, ImageURL, Tags } = data
  const [copyIcon, SetCopyIcon] = useState(<IoCopy />)

  const copyToClipboard = async (title, URL) => {
    await navigator.clipboard.writeText(`${title}: ${URL}`)

    SetCopyIcon(<IoCopyOutline />)

    setTimeout(() => {
      SetCopyIcon(<IoCopy />) // Revert back to copy icon after 2 seconds
    }, 100)
  }

  return (
    <div className="Ind-Card">
      <div className="Ind-Image-And-Title-Container">
        <div
          className="Ind-Copy-Container"
          onClick={() => copyToClipboard(Title, URL)}
        >
          <div className="Ind-Copy">{copyIcon}</div>
        </div>
        <div
          className="Ind-Open-Container"
          onClick={() => window.open(URL, "_blank")}
        >
          <IoOpen className="Ind-Open" />
        </div>
        <div className="Ind-Overlay">
          <img src={ImageURL} />
        </div>
        <div className="Ind-Title-Container">
          <h1 className="Ind-Title">{Title}</h1>
        </div>
      </div>
      <div className="Ind-Tags-Container">
        {Tags &&
          Tags.length > 0 &&
          Tags.map((tag) => (
            <span className="Ind-Tags" key={tag}>
              {tag}
            </span>
          ))}
      </div>
    </div>
  )
}

Card.propTypes = {
  data: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    URL: PropTypes.string.isRequired,
    created: PropTypes.string, // Assuming created is a string. Adjust type as necessary.
    ImageURL: PropTypes.string, // Assuming image is a string URL.
    Tags: PropTypes.arrayOf(PropTypes.string), // Assuming tags is an array of strings.
    rating: PropTypes.number, // Adjust type if rating is not a number.
  }).isRequired,
}

export default Card
