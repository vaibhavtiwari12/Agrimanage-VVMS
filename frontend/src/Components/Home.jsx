import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const content = useSelector(state => state.fetchDataReducer);

  //REDUX TESTING
  const getData = () => {
    console.log("Process ENV", process.env);
    fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then(res =>{
        if(!res.ok){
            throw Error (res.statusText)
        }else{
            return res.json()
        }
    }) 
    .then(res => {
      dispatch({
        type:"FETCH_DATA",
        data: res
      })
    })
    .catch(e => {
      dispatch ({
        type:"FETCH_DATA_ERROR",
        data: e
      })
    })
  }

  useEffect(() => {
    fetch(`/api/getName`)
    .then(res => res.json())
    .then(res => {
        setMessage(res.message);
        //CALLING REDUX FUNCTION
        getData();
        console.log(content)
    })
  }, [])
return (

    <div>
        
    </div>
)
}

export default Home;