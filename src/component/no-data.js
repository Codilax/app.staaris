import style from './no-data.module.css';

export function NoData({icon, body}){
    return(
        <div style={{
            display:"flex", 
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"center",
            padding:"20px 30px",
            fontSize:"15px",
            color:"var(--black-text)"
        }}>
           <div style={{color:"var(--brand-color)"}}> {icon} </div>
            <label style={{paddingTop:"10px", fontSize:"14px", textAlign:"center"}}>{body}</label>
        </div>
    )
}