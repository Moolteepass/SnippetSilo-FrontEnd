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
  const [returnMessage, setReturnMessage] = useState("")

  const magicSearch = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/getSocialImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: search,
        }),
      })
      setData(await response.json())
      console.log("Magic Search Data:", data) // Handle the response
    } catch (error) {
      console.error("Error fetching social image", error)
    }
  }

  const sendToPush = async () => {
    const dataToSend = {
      Title: data.pageTitle,
      URL: search,
      ImageURL: data.socialImage,
      Tags: data.tags || [],
    }

    fetch("http://localhost:3001/api/addData", {
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
          response.json().then((responseData) => {
            setReturnMessage(responseData.message) // Assuming responseData.message is your error message
          })
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        setReturnMessage("An error occurred")
      })
  }

  return (
    <div className="magicSearch">
      <h1>Let's do some magic</h1>
      <div className="magicSearchWrap">
        <input type="text" onChange={(e) => setSearch(e.target.value)} />
        <button className="magicSearch" onClick={magicSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
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
                Tags: data.tags || [],
              }}
            />
            <button className="magicSearchSubmit">
              <FontAwesomeIcon icon={faPaperPlane} onClick={sendToPush} />
            </button>
            <h2 className="magicSearchReturnMessage">{returnMessage}</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default MagicForm
