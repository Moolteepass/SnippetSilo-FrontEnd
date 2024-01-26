/* eslint-disable react/no-unescaped-entities */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMagnifyingGlass,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons"

import { useState } from "react"
import Card from "./Card"

const MagicForm = () => {
  const [data, setData] = useState("")
  const [search, setSearch] = useState("")
  const [tags, setTags] = useState("")
  const [returnMessage, setReturnMessage] = useState("")

  const magicSearch = async () => {
    try {
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
      setData(await response.json())
    } catch (error) {
      console.error("Error fetching social image", error)
    }
  }

  const sendToPush = async () => {
    const dataToSend = {
      Title: data.pageTitle,
      URL: search,
      ImageURL: data.socialImage,
      Tags: tagGrab(tags) || [],
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
            setReturnMessage(responseData.message) // Assuming responseData.message is your message
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          })
        } else {
          setReturnMessage("Something went wrong, try again") // Assuming responseData.message is your error message
        }
      })
      .catch((error) => {
        setReturnMessage("An error occurred:", error)
      })
  }

  function tagGrab(str) {
    const words = str.split(" ") // Split the input string into an array of words
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of each word
    })
    console.log(capitalizedWords)
    return capitalizedWords
  }

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
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Separate tags by spaces"
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div>
        {data.socialImage && data.pageTitle && (
          <div className="magicSearchPreview">
            <h1>Preview</h1>
            <Card
              data={{
                Title: data.pageTitle,
                URL: search,
                ImageURL: data.socialImage,
                Tags: tagGrab(tags) || [],
              }}
            />
            <button className="magicSearchSubmit">
              <FontAwesomeIcon icon={faPaperPlane} onClick={sendToPush} />
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
