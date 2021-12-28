import { useState, useEffect } from 'react'
import { projectAuth, projectStorage, projectFirestore} from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  // firestore에서는 디폴트로 authentication에서 email, password, displayName, photo url 받는다. 여기에 더 추가하고 싶으면 따로 firestore 파일을 만들어서 추가해야 한다.
  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)
  
    try {
      // [1] signup
      const res = await projectAuth.createUserWithEmailAndPassword(email, password)

      if (!res) { // if network error occurs
        throw new Error('Could not complete signup')
      }

      // [2] upload user thumbnail picture to firebase storage
      // : 이때 각각의 user 마다 폴더를 만들고, 폴더명은 uid 사용할것임. 그 폴더 안에 user img file저장할것임  (이건 개인이 정할 수 있음.개인마음임)
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`    // thumbnails라는 bucket 만들고, res.user.uid로 폴더 만들고, 그 안에 thumbnail.name으로 이미지 이름을 저장하기
      const img = await projectStorage.ref(uploadPath).put(thumbnail)  // ref는 storage built in method로 저장하고자 하는 경로 넣어주고 & put method는 저장하고자 하는 파일 넘기면, 해당 정보를 사용하여 이미지를 저장함..
      //console.log('img:', img) // img object는 엄청나게 많은 prop과 methods들은 가졌음.
      const imgUrl = await img.ref.getDownloadURL()  // img object에서 built in method인 ref.getDownloadURL()하면 url받아옴..
      // console.log("imgURL:", imgUrl) // 클릭하면 해당 파일이 나옴..(예:https://firebasestorage.googleapis.com/v0/b/project-management-site-e15f2.appspot.com/o/thumbnails%2F3wf6g6SvftcFr7tiCjTgnYYHHPJ2%2F1.jpeg?alt=media&token=9ca9fe6c-c720-4554-8b32-f53c598e2b46)
    
      
      // [3]  signup이 성공적이였으면 res를 리턴하고, 우리가 필요한 정보들은 res.user object안에 다 있다
      // ! 중요 ! res.user안에는 fire store가 만든 uid도 있는데, 규영이면 규영이만의 uid 가 있음. 이걸로 데이터 access 권한을 결정할 것임 (규영이는 규영이가 create한것만 보게 하는 등)
      // display name을 res.user에 추가하기 위해서 fire store의 빌트인 메서드인 updateProfile사용하기. 이때 object를 argument로 받으므로 {}쓰기 
      await res.user.updateProfile({ displayName, photoURL: imgUrl })

      // [온라인 여부용] users라는 콜렉션 만들고, document id를 res.user.id로 만들고 저장하기 // 해당 collection이 아직 없으면 새로 만들어줌.
      await projectFirestore.collection('users').doc(res.user.uid).set({          // .add()는 새로운 id를 만들어주고, .doc()은 원하는 걸로 id 찾거나 만들수 있어서 doc사용함.
        online:true,
        displayName,
        photoURL:imgUrl
      })

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