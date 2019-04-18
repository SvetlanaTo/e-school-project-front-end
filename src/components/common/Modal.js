import React from 'react';
import '../../style/common/modal.css';

class Modal extends React.Component {
    render() {

        if (!this.props.show) {
            return null;
        }

        return (
            <div className="backdrop">
                <div className="modal">
                    <button onClick={this.props.onClose}>Close </button>
                    {this.props.children}
                    <div className="modal_footer">

                    </div>
                </div>
            </div>
        );
    }
}


export default Modal;