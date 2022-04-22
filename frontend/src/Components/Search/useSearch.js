import { useEffect, useState } from "react";

const useSearch = (setSearchTermChange, setSearchTermType) => {
  const [searchTerm, setSearchTermState] = useState("");
  const [searchType, setSearchTypeState] = useState("Name");
  /*  useEffect(() => {
    console.log(searchType);
  }, [searchType]); */
  const handleReset = async (event) => {
    setSearchTermState("");
    setSearchTypeState("Name");
    setSearchTermType("Name");
    setSearchTermChange("");
  };
  const handleChange = (event) => {
    setSearchTermState(event.target.value);
    setSearchTermChange(event.target.value);
  };
  const handleSelectChange = (event) => {
    setSearchTypeState(event.target.value);
    setSearchTermType(event.target.value);
  };
  return {
    handleChange,
    handleSelectChange,
    handleReset,
    searchTerm,
    searchType,
  };
};

export default useSearch;
