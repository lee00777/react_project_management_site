import { useState, useEffect } from 'react'
import { projectAuth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  // firestore에서는 디폴트로 authentication에서 email, password, displayName, profilePicture만 받는다. 여기에 더 추가하고 싶으면 따로 firestore 파일을 만들어서 추가해야 한다.
  const signup = async (email, password, displayName) => {
    setError(null)
    setIsPending(true)
  
    try {
      // signup
      const res = await projectAuth.createUserWithEmailAndPassword(email, password)

      if (!res) { // if network error occurs
        throw new Error('Could not complete signup')
      }
      // signup이 성공적이였으면 res를 리턴하고, 우리가 필요한 정보들은 res.user object안에 다 있다
      // ! 중요 ! res.user안에는 fire store가 만든 uid도 있는데, 규영이면 규영이만의 uid 가 있음. 이걸로 데이터 access 권한을 결정할 것임 (규영이는 규영이가 create한것만 보게 하는 등)
      // display name을 res.user에 추가하기 위해서 fire store의 빌트인 메서드인 updateProfile사용하기. 이때 object를 argument로 받으므로 {}쓰기 
      await res.user.updateProfile({ displayName })

      // authContext에 있는 useReducer사용할 것임. 여기에 res.user 넘길것임
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) { // password is too short, or email is not invalid
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}