import { useEffect, useState } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch, user } = useAuthContext()
  
  const logout = async () => {
    setError(null)
    setIsPending(true)

    try {
      // users collection에 있는 online property false로 만들기
      // const { uid } = projectAuth.currentUser
      console.log('log out page:', user.uid)
      await projectFirestore.collection('users').doc(user.uid).update({online:false})  // uid 대신 projectAuth가서 projectAuth.currentUser.uid해도 됨..

      // sign the user out
      await projectAuth.signOut()
      
      // dispatch logout action
      dispatch({ type: 'LOGOUT' })

      // isCancelled가 false일때에만 실행해라.. (해당 component가 unmounted되면 isCancelled는 true가 되므로 아래의 code 실행하지 않는다)
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      } 
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    // it will run WHEN the component is UNMOUNTED
    return () => setIsCancelled(true)
  }, [])

  return { logout, error, isPending }
}