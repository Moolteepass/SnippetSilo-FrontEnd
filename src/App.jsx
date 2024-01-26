import { useState, useEffect } from "react"
import Airtable from "airtable"
import "./App.css"
import Card from "./components/Card"

/* Font awesome */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import Modal from "./components/Modal"

function App() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)

  async function testBackendConnection() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/test`
      )
      const data = await response.json()
      console.log("Response from backend:", data)
    } catch (error) {
      console.error("Error fetching from backend:", error)
    }
  }

  useEffect(() => {
    testBackendConnection()
  }, [])

  useEffect(() => {
    const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY

    // Function to fetch data
    const fetchData = async () => {
      var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
        "appOOlZ2AISbHpbVb"
      )

      let allRecords = []

      base("All Clips")
        .select({
          fields: ["Title", "URL", "ImageURL", "Rating", "Tags"],
          sort: [{ field: "ID", direction: "desc" }],
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function (record) {
              allRecords.push(record.fields)
            })
            fetchNextPage()
          },
          function done(err) {
            if (err) {
              console.error(err)
              return
            }
            setData(allRecords)
            localStorage.setItem("cachedData", JSON.stringify(allRecords))
            console.log("fetchResult", allRecords)
          }
        )
    }

    // Load data from localStorage or fetch it
    if (localStorage.getItem("cachedData") !== null) {
      console.log("cachedData exists, loading now")
      setData(JSON.parse(localStorage.getItem("cachedData")))
    }
    fetchData()
  }, [])

  /* Make sure search works */
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  /* Filter data */
  const filteredData = data.filter((item) => {
    // Split search term into tags and title parts
    const parts = search
      .toLowerCase()
      .split(" ")
      .filter((part) => part)
    const tagParts = parts
      .filter((part) => part.startsWith("."))
      .map((tag) => tag.substring(1))
    const titleParts = parts.filter((part) => !part.startsWith("."))

    // Check if the search term is in the 'Title' field
    const titleMatch =
      titleParts.length === 0 ||
      (item.Title &&
        titleParts.every((part) => item.Title.toLowerCase().includes(part)))

    // Check if the search term is in the 'Tags' field (assuming 'Tags' is an array of strings)
    const tagsMatch =
      tagParts.length === 0 ||
      (item.Tags &&
        tagParts.every((tag) =>
          item.Tags.some((itemTag) => itemTag.toLowerCase().includes(tag))
        ))

    // Return true if the item matches the search term in either 'Title' or 'Tags'
    return titleMatch && tagsMatch
  })

  /* Toggle Modal */
  const toggleModal = () => {
    setShowModal(!showModal)
  }

  return (
    <div className="App">
      <div className="Header-Container">
        {/* Search bar */}
        <input
          type="text"
          placeholder={`(Version 4.0) ${filteredData.length} records`}
          value={search}
          onChange={handleSearchChange} // Use the handleSearchChange here
        />
        {/* Modal */}
        <button className="toggleModal" onClick={toggleModal}>
          <FontAwesomeIcon className="faCirclePlus" icon={faCirclePlus} />
        </button>
        {showModal && (
          <div className="modal">
            <div className="modalWrap">
              <p>Add new record</p>
              <button onClick={toggleModal}>
                <FontAwesomeIcon
                  className="faCircleXmark"
                  icon={faCircleXmark}
                />
              </button>
            </div>
            <Modal />
          </div>
        )}
      </div>
      {/* Cards */}
      <div className="Card-Container">
        {filteredData.map((item, index) => (
          <Card key={index} data={item} />
        ))}
      </div>
    </div>
  )
}

export default App
