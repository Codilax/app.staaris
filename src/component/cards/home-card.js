import style from './home-card.module.css'

function HomeCard( { items } ){
    return(
        <div className={`${style.homeCard}`} >
            { items } 
        </div>
    )
}

export default HomeCard;