import React from 'react';
import '../../style/common/modal.css';

class MyStudentMarksModal extends React.Component {
    render() {

        if (!this.props.getMarks) {
            return null;
        }

        return (
            <div className="backdrop">
                <div className="modal">
                    <div className="modal_footer">
                        <button onClick={this.props.hideMarks}>Close </button>                        
                    </div>
                    {this.props.children}
                    
                </div>
            </div>
        );
    }
}


export default MyStudentMarksModal;