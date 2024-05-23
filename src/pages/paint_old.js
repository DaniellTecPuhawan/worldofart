import { useEffect, useState } from "react";

const Paint = () => {
    
    const [wofDatas, setwofDatas] = useState(null);

    useEffect(() => {
      const fetchwofDatas = async () => {
      
          const response = await fetch('/wofdata'); // Assuming your backend server runs on the same domain
          const json = await response.json()

            if(response.ok){
                setwofDatas(json)
            } 
    }
      fetchwofDatas();
    }, [])

    return(
        <div>
        <h1>Data from MongoDB</h1>
        {wofDatas && wofDatas.map((wofData) => (

          <ul key={wofData.id}>
            
            <li>{wofData.name}</li>
            <li>{wofData.title}</li>
            <li>{wofData.story}</li>
            <li>{wofData.type}</li>
            <li>{wofData.range}</li>
            <li>{wofData.movementSpeed}</li>
            <li>{wofData.Enchantment}</li>

          </ul>
              
        ))}
        
      </div>
    );
  };

export default Paint