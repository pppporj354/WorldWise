import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useCities } from "../contexts/CitiesContext"
import BackButton from "./BackButton"
import styles from "./City.module.css"
import Spinner from "./Spinner"

const formatDate = (date) => {
  if (!date) return "No date"

  if (date?.seconds) {
    try {
      const timestamp = new Date(date.seconds * 1000)
      return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      }).format(timestamp)
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid date"
    }
  }

  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date string:", date)
      return "Invalid date"
    }

    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(parsedDate)
  } catch (error) {
    console.error("Date formatting error:", error)
    return "Invalid date"
  }
}
function City() {
  const [weather, setWeather] = useState(null)
  const { id } = useParams()
  const { getCity, currentCity, isLoading } = useCities()
  const { cityName, emoji, date, notes } = currentCity

  const WEATHER_API_KEY = "cb5bcfeaeb229d16cb50241c51078d9d"

  useEffect(
    function () {
      getCity(id)
    },
    [id, getCity]
  )

  useEffect(
    function () {
      if (!currentCity.position) return

      async function fetchWeather() {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${currentCity.position.lat}&lon=${currentCity.position.lng}&appid=${WEATHER_API_KEY}&units=metric`
          )
          const data = await res.json()
          setWeather(data)
        } catch (err) {
          console.error("Error loading weather data", err)
        }
      }

      fetchWeather()
    },
    [currentCity.position]
  )

  if (isLoading) return <Spinner />

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      {weather && (
        <div className={styles.row}>
          <h6>Weather right now</h6>
          <p>
            {Math.round(weather.main.temp)}°C, {weather.weather[0].description}
          </p>
          <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  )
}

export default City
