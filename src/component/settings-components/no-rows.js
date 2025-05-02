export function NoRows({icon, text}){

    return(
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", color:"var(--black-text)", padding:"15px 20px" }}>
            <div style={{fontSize:"20px"}}>{icon}</div>
            <label style={{textAlign:"center"}}>{text}</label>
        </div>
    )
}