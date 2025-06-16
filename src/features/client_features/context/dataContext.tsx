import { createContext, Dispatch, useContext, useReducer } from 'react'

const initialState = {
  classrooms: [],
  teachers: [],
  students: [],
  users: [],
} as const

type State = typeof initialState

export const DataContext = createContext<{
  state: State
  dispatch: Dispatch<Action>
  setClassrooms: (classrooms: any) => void
  setTeachers: (teachers: any) => void
  setStudents: (students: any) => void
  setUsers: (users: any) => void
}>({
  state: initialState,
  dispatch: () => {},
  setClassrooms: () => {},
  setTeachers: () => {},
  setStudents: () => {},
  setUsers: () => {},
})

type Action = {
  type: 'SET_CLASSROOMS' | 'SET_TEACHERS' | 'SET_STUDENTS' | 'SET_USERS'
  payload: any
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_CLASSROOMS':
      return { ...state, classrooms: action.payload }
    case 'SET_TEACHERS':
      return { ...state, teachers: action.payload }
    case 'SET_STUDENTS':
      return { ...state, students: action.payload }
    default:
      return state
  }
}

const useStore = () => {
  const [state, dispatch] = useReducer(reducer, {
    classrooms: [],
    teachers: [],
    students: [],
    users: [],
  })
  const setClassrooms = (classrooms: any) => {
    dispatch({ type: 'SET_CLASSROOMS', payload: classrooms })
  }
  const setTeachers = (teachers: any) => {
    dispatch({ type: 'SET_TEACHERS', payload: teachers })
  }
  const setStudents = (students: any) => {
    dispatch({ type: 'SET_STUDENTS', payload: students })
  }
  const setUsers = (users: any) => {
    dispatch({ type: 'SET_USERS', payload: users })
  }
  return {
    state,
    dispatch,
    setClassrooms,
    setTeachers,
    setStudents,
    setUsers,
  }
}

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  return <DataContext.Provider value={useStore()}>{children}</DataContext.Provider>
}

export const useDataContext = () => {
  const { state, dispatch, setClassrooms, setTeachers, setStudents, setUsers } =
    useContext(DataContext)
  return { state, dispatch, setClassrooms, setTeachers, setStudents, setUsers }
}
