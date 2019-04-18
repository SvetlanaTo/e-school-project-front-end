import React from 'react';
import { Link } from 'react-router-dom';

import '../../style/common/notauth.css';

const NotAuth = () => {
    return (
        <div className="no_auth">
            <div className="no_auth_photo"></div>
            {/* <span>Ups, the page you are looking for does not exist</span> */}
            
            <Link to="/"><button id="return_home_div">RETURN HOME</button></Link>
            
        </div>
    )
}

export default NotAuth;