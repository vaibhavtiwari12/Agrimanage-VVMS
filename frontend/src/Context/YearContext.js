const { createContext } = require('react');

const initialState = {
  year: undefined,
  onSetYear: () => {},
  yearOptions: [],
  isYearLoading: false,
};

const YearContext = createContext(initialState);

export default YearContext;
