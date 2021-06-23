import { createContext, ReactNode, useEffect, useState } from 'react'

import { auth, firebase } from '../services/firebase'

type UserData = {
  uid: string
  displayName: string | null
  photoURL: string | null
}

type User = {
  id: string
  name: string
  avatar: string
}

type AuthContextType = {
  user: User | undefined
  signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>()

  function handleSetUser(userData: UserData) {
    const { displayName, photoURL, uid } = userData

    if (!displayName || !photoURL) {
      throw new Error('Missing information from Google Account')
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL
    })
  }

  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        handleSetUser(user)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])


  async function signInWithGoogle() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(googleAuthProvider)

    if (result.user) {
      handleSetUser(result.user)
    }
  }
  
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}
