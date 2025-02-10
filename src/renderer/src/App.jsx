// export default function App() {
//   return (
//     <>
//       <h1>Hello, world!</h1>
//     </>
//   )
// }

import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"


function App() {
  const [ partners, setPartners ] = useState([])
  useEffect(() => {
    (async () => {
      const res = await window.api.getPartners()
      setPartners(res)
    })()
  }, [])

  return (
    <>
      <h1>Партнеры</h1>
      <table>
        {partners}
      </table>
    </>
  )
  
}

export default App;