import Cards from "../Cards/Cards";
import './testScroll.css'

function testScroll () {

    return (
        <div className="cards-container">
         <Cards type= "coffee"/>
         <Cards type= "coffee"/>
         <Cards type= "coffee"/>
         <Cards type= "coffee"/>
         <Cards type= "coffee"/>
        </div>
    )
}

export default testScroll;