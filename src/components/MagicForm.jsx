/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react"
import CardTemplate from "./CardTemplate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMagnifyingGlass,
  faPaperPlane,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"

const MagicForm = () => {
  const [data, setData] = useState("")
  const [search, setSearch] = useState("")
  const [tags, setTags] = useState([]) // Change to an empty array
  const [returnMessage, setReturnMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [send, setSending] = useState(false)
  const [title, setTitle] = useState("") // New state for title

  const magicSearch = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/getSocialImage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: search,
          }),
        }
      )
      const result = await response.json()
      setData(result)
      setTitle(result.pageTitle) // Set title from the fetched data
      setLoading(false)
    } catch (error) {
      console.error("Error fetching social image", error)
      setLoading(false)
    }
  }

  const sendToPush = async () => {
    setSending(true)
    const dataToSend = {
      Title: title, // Use the title state
      URL: search,
      ImageURL: data.socialImage,
      Tags: tags.length > 0 ? tags : [], // Ensure we send an empty array if there are no tags
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((responseData) => {
            setReturnMessage(responseData.message)
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          })
        } else {
          setReturnMessage("Something went wrong, try again")
        }
      })
      .catch((error) => {
        setReturnMessage("An error occurred:", error)
      })
  }

  function tagGrab(str) {
    const words = str.trim().split(/\s+/) // Split by whitespace
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    return capitalizedWords
  }

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle) // Update title state when it changes in CardTemplate
  }

  useEffect(() => {
    console.log("title:", title)
  }, [title])

  return (
    <div className="magicSearch">
      <h1>Let's do some magic</h1>
      <div className="magicSearchAndTagsWrap">
        <div className="magicSearchWrap">
          <input
            type="text"
            placeholder="Enter URL"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="magicSearch" onClick={magicSearch}>
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} className="spin-fast" />
            ) : (
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            )}
          </button>
        </div>
        <input
          type="text"
          placeholder="Separate tags by spaces"
          onChange={(e) => setTags(tagGrab(e.target.value))} // Update tags directly from the input
        />
      </div>
      <div>
        {data.socialImage && data.pageTitle && (
          <div className="magicSearchPreview">
            <h1>Preview</h1>
            <CardTemplate
              data={{
                Title: title, // Use the title state here
                URL: search,
                ImageURL: data.socialImage,
                Tags: tags,
              }}
              onTitleChange={handleTitleChange} // Pass the callback to update title
            />
            <button className="magicSearchSubmit">
              {send ? (
                <FontAwesomeIcon icon={faSpinner} className="spin-fast" />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} onClick={sendToPush} />
              )}
            </button>
            <h2
              className="magicSearchReturnMessage"
              style={
                returnMessage === "Data added successfully"
                  ? { color: "rgb(0, 226, 0)" }
                  : { color: "red" }
              }
            >
              {returnMessage}
            </h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default MagicForm
