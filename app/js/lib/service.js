import axios from 'axios'

export const saveJson = (json) =>
  axios.post('http://localhost:8000/json', json)

  // export const loadJson = () =>
  //   axios.get('http://localhost:8000/json/GlobalRankings.json')

    // export const loadJson = () =>
    //   axios.get('http://localhost:8000/json/globalRankings')

      export const loadJson = () =>
        axios.get('http://localhost:8000')
