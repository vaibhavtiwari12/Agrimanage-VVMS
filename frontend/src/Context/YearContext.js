const { createContext } = require("react")

const initialState = {
    year: undefined,
    onSetYear : () =>{}
}

const YearContext = createContext(initialState)

export default YearContext;