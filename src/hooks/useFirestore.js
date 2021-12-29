import { useReducer, useEffect, useState } from "react"
import { projectFirestore, timestamp } from "../firebase/config"

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      // return { isPending: true, document: null, success: false, error: null }
      return { ...state, isPending: true }
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null }
    case 'UPDATED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'ERROR':
      return { isPending: false, document: null, success: false, error: action.payload }
    default:
      return state
  }
}

// fire store에서 collection에 있는 **single** doc 관련 add, delete, update등 하기
export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)
  const ref = projectFirestore.collection(collection)

  // component가 mounted되어 있을때에만 실행해라 (unmounted되었을때 set을 하면 에러가 난다.. 없는 component의 변수의 값을 바꾸려고 하므로. 여기서는 document, error바뀔때마다 사용)
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' })
    try {
      const createdAt = timestamp.fromDate(new Date())  // timestamp는 firebase config파일에서 만든것으로, firebase는 특유의 date data type을 가지고 있는데 그걸 firebase스타일로 바꿔서 저장
      // fire store built-in method "add"
      const addedDocument = await ref.add({ ...doc, createdAt }) // doc은 user가 form 버튼 같은거 눌렀을때 넘기는 data임..
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      // fire store built-in method "delete"
      await ref.doc(id).delete()
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
    }
  }
  const updateDocument = async(id, updates) => {
    dispatch({type:'IS_PENDING'})
    try{
      const updatedDocument = await ref.doc(id).update(updates) // fire store에서는 update(넘기는 정보), 넘기는 정보만 수정하고 나머지는 그대로 둔다..by default
      dispatchIfNotCancelled({type:'UPDATED_DOCUMENT', payload:updatedDocument})
      return updatedDocument
    }catch{
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not updated' })
      // return null  // 필요없을것임..그냥 써본 것임..
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { addDocument, deleteDocument, response }

}
