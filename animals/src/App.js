import { useState } from "react";
import AnimalShow from './AnimalShow.js'
function getRandomAnimal(){
  const animals = ['bird','cat','cow','gator','horse'];
  return animals[Math.floor(Math.random()*animals.length)];
}

function App() {

  const [animals, setAnimals] = useState(0);

  const handleClick = () => {
    setAnimals([...animals,getRandomAnimal()]);
  };

  const renderedAnimals = animals.map((animal,index) => {
    return <AnimalShow key={index} type={animal}/>;
  });
  
  return (
    <div>
      <button onClick={handleClick}>Add animal</button>
      <div>{renderedAnimals}</div>
    </div>
  );
}

export default App;
