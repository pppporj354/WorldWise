import { createContext, useContext, useReducer, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth } from "../config/firebase"

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

function reducer(state, action) {
  switch (action.type) {
    case "auth/initialized":
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        isAuthenticated: !!action.payload,
      }
    case "auth/login":
      return { ...state, user: action.payload, isAuthenticated: true }
    case "auth/logout":
      return { ...state, user: null, isAuthenticated: false }
    default:
      throw new Error("Unknown action")
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "auth/initialized", payload: user })
    })
    return unsubscribe
  }, [])

  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      dispatch({ type: "auth/login", payload: userCredential.user })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      dispatch({ type: "auth/login", payload: userCredential.user })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      dispatch({ type: "auth/logout" })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  if (isLoading) return null

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider")
  return context
}

export { AuthProvider, useAuth }
