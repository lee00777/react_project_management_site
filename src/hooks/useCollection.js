import { useEffect, useState, useRef } from "react"
import { projectFirestore } from "../firebase/config"

// fire store에서 collection에 있는 **모든** docs들 가져오기
export const useCollection = (collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)

  // _query는 docs중에서 특정한 docs만 가져올때 사용 => option으로 넘길때도 안넘길때도 있을것임
  // _orderBy 는 docs들을 특정한 순서로 나열할때 사용 => option으로 넘길때도 안넘길때도 있을것임
  const query = useRef(_query).current  // useRef사용하는 이유는 useEffect dependency로 array는 새로운 reference만들어서 infinite loop에 빠지는걸 맊기위함임 (useState써도 동일한효과임)
  const orderBy = useRef(_orderBy).current // !!! 중요 !!! firestore database 웹사이트가서 create index클릭해주고 몇분 기다려야 작동함 (where, orderBy 둘중에 하나라도 바꿀경우..)

  useEffect(() => {
    let ref = projectFirestore.collection(collection)

    if (query) { // query의 형태는 ["doc에 저장된 prop이름","==","컨디션충족할애들"] . 예) ["uid","==",user.uid]
      ref = ref.where(...query)   // 그러므로 ...사용하기
    }
    if (orderBy) {
      ref = ref.orderBy(...orderBy)
    }

    const unsubscribe = ref.onSnapshot(snapshot => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({...doc.data(), id: doc.id})  // uid(=user id)정보는 doc.id에서 얻을 수 있다
      });
      setDocuments(results)
      setError(null)
    }, error => {
      console.log(error)
      setError('could not fetch the data')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [collection, query, orderBy])

  return { documents, error }
}