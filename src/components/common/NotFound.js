import React from 'react';
import { Link } from 'react-router-dom';

import '../../style/common/notfound.css';

const NotFound = () => {
    return (
        <div className="not_found">
            <div className="sad_photo"></div>
            {/* <span>Whoops! Page not found.</span> */}

            <Link to="/"><button id="return_home_not_found">RETURN HOME</button></Link>
        </div>
    )
}

export default NotFound;