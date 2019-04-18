import React from 'react';
import '../../style/common/mymodal.css';

class MyTeacherSubjectsModal extends React.Component {
    render() {

        if (!this.props.get) {
            return null;
        }

        return (
            <div className="mybackdrop">
                <div className="mymodal">
                <button onClick={this.props.hide} className="mymodal_close_button"> Close </button>
                    {this.props.children}
                    <div className="mymodal_footer">                        
                        
                    </div>
                </div>
            </div>
        );
    }
}


export default MyTeacherSubjectsModal;