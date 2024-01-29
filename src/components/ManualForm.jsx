/* eslint-disable react/no-unescaped-entities */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"

import { useState } from "react"
import Card from "./Card"

const ManualForm = () => {
  const [title, setTitle] = useState("")
  const [URL, setURL] = useState("")
  const [imageURL, setImageURL] = useState("")
  const [tags, setTags] = useState("")
  const [returnMessage, setReturnMessage] = useState("")

  const sendToPush = async () => {
    const dataToSend = {
      Title: title,
      URL: URL,
      ImageURL: imageURL,
      Tags: tags ? tagGrab(tags) : [],
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
    return capitalizedWords
  }

  return (
    <div className="manualSearch">
      <h1>Enter some details</h1>
      <div className="manualSearchWrap">
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL"
          onChange={(e) => setURL(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          onChange={(e) => setImageURL(e.target.value)}
        />
        <input
          type="text"
          placeholder="Separate tags by spaces"
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div>
        <div className="manualSearchPreview">
          <h1>Preview</h1>
          <Card
            data={{
              Title: title ? title : "The Coolest Title Ever",
              URL: URL,
              ImageURL: imageURL
                ? imageURL
                : "https://images.unsplash.com/photo-1543083115-638c32cd3d58?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NpJTIwZml8ZW58MHx8MHx8fDA%3D",
              Tags: tagGrab(tags) || [],
            }}
          />
          <button className="manualSearchSubmit">
            <FontAwesomeIcon icon={faPaperPlane} onClick={sendToPush} />
          </button>
          <h2
            className="manualSearchReturnMessage"
            style={
              returnMessage === "Data added successfully"
                ? { color: "rgb(0, 226, 0)" }
                : { color: "red" }
            }
          >
            {returnMessage}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default ManualForm
