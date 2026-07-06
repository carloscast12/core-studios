import { useState, useEffect } from "react";


function Practica() {

const [likes, setLikes]=useState({});
const [posts, setPosts] = useState([])

  useEffect(()=>{
    const fetchData = async () =>{
      await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then(res=>res.json())
      .then(data=>setPosts(data))
    }
    fetchData()
  },[])

  const handleLikes = (id) => {
    const likesActualizados = Object.assign({},likes)
    likesActualizados[id] = (likes[id] || 0) + 1;
    setLikes(likesActualizados)
  }
    return (
      <div>
        <h1>Práctica</h1>

        {posts.map(post => (
        <div key={post.id}>
          <p>{post.title}</p>
          <button onClick={() => handleLikes(post.id)}>Like {likes[post.id] || 0}</button>
        </div>
))}
       
      </div>
    )
  }
  
  export default Practica
  