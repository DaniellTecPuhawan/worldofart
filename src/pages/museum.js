import React, { useEffect, useState } from 'react';
import { ImageDb } from '../../src/firebaseConfig';
import { uploadBytes, ref, listAll, getDownloadURL } from 'firebase/storage';
import { v4 } from "uuid"

function ImageUpload(){

  const [img, setImg] = useState('')
  const [ imgUrl, setImgUrl ] = useState([])

  const handleClick = () => {
    if(img !== null){
    const imgRef = ref(ImageDb, `files/${v4()}`)
    uploadBytes(imgRef, img).then(value=>{
      console.log(value)
    })
    }
  }
  
  useEffect(() => {
    listAll(ref(ImageDb, "files")).then(imgs=>{
      console.log(imgs)
      imgs.items.forEach(val=>{
        getDownloadURL(val).then(url=>{
          setImgUrl(data=>[...data, url])
        })
      })
    })
  },[])

  //console.log(imgUrl, "imgUrl")

return(

  <div className="container">
  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
    <input type="file" onChange={(e)=>setImg(e.target.files[0])}/>
    <button className="btn btn-primary" onClick={handleClick}>Upload</button>

    <br/>
   
    {
      imgUrl.map(dataVal=> <div className="col">
      <div className="card mb-3">
          <div className="card-body">
      <img src={dataVal} height="200px" width="200px" />
      <br/> 
      </div></div></div>)
    }
  
  </div>

  </div>

  )
}
export default ImageUpload;