import style from './hbar.module.css';

function HBar({isSlim}){
    return(
        <div className={(isSlim)?style.barSlim:style.bar}> </div>
    )
}
export default HBar;