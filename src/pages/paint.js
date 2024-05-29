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
<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {/* Renderizar tarjetas para cada elemento */}
                {wofDatas &&
                    wofDatas.map((wofData) => (
                        <div className="col" key={wofData._id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{wofData.name}</h5>
                                    <p className="card-text">{wofData.title}</p>
                                    <p className="card-text">{wofData.story}</p>
                                    <p className="card-text">{wofData.type}</p>
                                    <p className="card-text">{wofData.range}</p>
                                    <p className="card-text">{wofData.movementSpeed}</p>
                                    <p className="card-text">{wofData.Enchantment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
    );
  };

export default Paint