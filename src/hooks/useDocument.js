import { useEffect, useState } from "react"
import { projectFirestore } from "../firebase/config"

// fire store에서 collection에 있는 **single** doc REAL TIME으로 가져오기
export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  useEffect(()=>{
    const ref = projectFirestore.collection(collection).doc(id)
    const unsubscribe = ref.onSnapshot(snapshot=>{
      if(snapshot.data()){  // if id is valid
        setDocument({...snapshot.data(), id:snapshot.id})
        setError(null)
      }else{
        setError('No such document exists')
      }
    }, (err) => {
      console.log(err.message)
      setError('Failed to get document')
    })
    return(()=>{ unsubscribe() })
  },[collection, id])

  return { error, document}
}