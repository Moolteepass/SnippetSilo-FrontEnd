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

  useEffect(() => {
    const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
    console.log(AIRTABLE_API_KEY)
    // Load data from localStorage or fetch it
    if (localStorage.getItem("cachedData") !== null) {
      console.log("cachedData exists, loading now")
      setData(JSON.parse(localStorage.getItem("cachedData")))
    } else {
      console.log("cachedData does not exist, fetching now")
    }

    const fetchData = async () => {
      console.log("cachedData does not exist, fetching now")
      var base = new Airtable({
        apiKey: AIRTABLE_API_KEY,
      }).base("appOOlZ2AISbHpbVb")

      let allRecords = []

      base("All Clips")
        .select({
          fields: ["Title", "URL", "ImageURL", "Rating", "Tags"],
          sort: [{ field: "ID", direction: "desc" }],
        })
        .eachPage(
          function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            records.forEach(function (record) {
              allRecords.push(record.fields)
            })

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
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

    fetchData()
  }, []) // Removed data from dependency array

  /* Make sure search works */
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  /* Filter data */
  const filteredData = data.filter((item) => {
    // Convert search term to lowercase for case-insensitive comparison
    const searchTerm = search.toLowerCase()

    // Check if the search term is in the 'Title' field
    const titleMatch =
      item.Title && item.Title.toLowerCase().includes(searchTerm)

    // Check if the search term is in the 'Tags' field (assuming 'Tags' is an array of strings)
    const tagsMatch =
      item.Tags &&
      item.Tags.some((tag) => tag.toLowerCase().includes(searchTerm))

    // Return true if the item matches the search term in either 'Title' or 'Tags'
    return titleMatch || tagsMatch
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
          placeholder={`(Version 2.3) ${filteredData.length} records`}
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
