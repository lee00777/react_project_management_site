import { createContext, useReducer, useEffect } from 'react'
import { projectAuth } from '../firebase/config'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }  // user안에는 fires store에서 만든 uid도 있다
    case 'LOGOUT':
      return { ...state, user: null }
    case 'AUTH_IS_READY':
      return { ...state, user: action.payload, authIsReady: true }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null,
    authIsReady: false // fire base의 auth가 현재 user가 login 되었는지 아닌지 확인활때까지 기다리는 용도. 확인이 끝나면 true로 되고, 그때 모든 App component들을 시작할것임.
  })

  useEffect(() => {
    // 사용자가 로그인을 한 후에 refresh (reload)버튼 눌렀을때, user:null이 되는 문제를 해결하기 위한 코드임
    // : when the page loads initially or when the user clicks the reload button, we need to check "authentication state" from fire base AND THEN START TO RENDER APP COMPONENT
    // : 즉, authIsReady가 true이면 그때 render app component 시작해라. (참고: 여기서 user는 정보가 없으면 null을 주고, 있으면 res.user랑 동일한 정보를 리턴함)
  
    // 단 firestore의 snapshot과 비슷해서 onAuthStateChanged도 처음 useEffect로 실행되고, !! 한번 실행되면 !! 계속 authentication observe하다가 change (sign in, log in, log out)가 있을때마다 실행된다.
    // 그러므로, 맨 처음 authentication state상태를 맨 처음에만 체크하고, 그 다음에는 필요없으므로 unsub()를 해야함.. 
    const unsub = projectAuth.onAuthStateChanged(user => {
      dispatch({ type: 'AUTH_IS_READY', payload: user })
      unsub()  // 맨 처음 앱 시작될때 실행되고 바로 정지시켜라..
    })
  }, [])

  console.log('AuthContext state:', state)
  console.log('AuthContext state user:', state.user)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}