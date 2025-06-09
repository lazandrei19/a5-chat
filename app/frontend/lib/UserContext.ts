import { createContext } from "react"

export type User = {}
type UserContextType = { user: User, loggedIn: true } | { user: null, loggedIn: false }

export const UserContext = createContext<UserContextType>({ loggedIn: false, user: null })