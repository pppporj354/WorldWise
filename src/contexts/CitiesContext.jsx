import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react"
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore"
import { db } from "../config/firebase"
import { useAuth } from "./AuthContext"

const CitiesContext = createContext()

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
}

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true }

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      }

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      }

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      }

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      }

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    default:
      throw new Error("Unknown action")
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  )
  const { user } = useAuth()

  useEffect(
    function () {
      async function fetchCities() {
        dispatch({ type: "loading" })
        try {
          const citiesRef = collection(db, "cities")
          const q = query(citiesRef, where("userId", "==", user.uid))
          const querySnapshot = await getDocs(q)

          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

          dispatch({ type: "cities/loaded", payload: data })
        } catch {
          dispatch({
            type: "rejected",
            payload: "There was an error loading cities...",
          })
        }
      }
      if (user) fetchCities()
    },
    [user]
  )

  const getCity = useCallback(
    async function getCity(id) {
      if (id === currentCity.id) return

      dispatch({ type: "loading" })
      try {
        const cityRef = doc(db, "cities", id)
        const citySnap = await getDoc(cityRef)

        if (citySnap.exists()) {
          const data = {
            id: citySnap.id,
            ...citySnap.data(),
          }
          dispatch({ type: "city/loaded", payload: data })
        }
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city...",
        })
      }
    },
    [currentCity.id]
  )

  async function createCity(newCity) {
    dispatch({ type: "loading" })
    try {
      const { date, ...restOfCity } = newCity
      const timestamp = new Date(date)

      if (isNaN(timestamp.getTime())) {
        throw new Error("Invalid date")
      }

      const citiesRef = collection(db, "cities")
      const docRef = await addDoc(citiesRef, {
        ...restOfCity,
        userId: user.uid,
        date: timestamp,
        createdAt: new Date(),
      })

      const city = {
        id: docRef.id,
        ...restOfCity,
        date: timestamp,
      }

      dispatch({ type: "city/created", payload: city })
    } catch (error) {
      console.error("Error creating city:", error)
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      })
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" })
    try {
      const cityRef = doc(db, "cities", id)
      await deleteDoc(cityRef)
      dispatch({ type: "city/deleted", payload: id })
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      })
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  )
}

function useCities() {
  const context = useContext(CitiesContext)
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider")
  return context
}

export { CitiesProvider, useCities }
