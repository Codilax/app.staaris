import constants from '../../constants';
import style from './indicator.module.css';

function Indicator( {remark} ){
    return(
        <div className={`${style.indicator} ${ (remark==constants.pass)? style.pass:style.fail  }`}> </div>
    )
}

export default Indicator;