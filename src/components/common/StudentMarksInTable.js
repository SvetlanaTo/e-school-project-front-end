import React from 'react';

class StudentMarksInTable extends React.Component {
    render() {

        if (!this.props.getMarksInTable) {
            return null;
        }

        return (
            <div className="backdrop">
                <div className="modal">
                    <div className="modal_footer">
                        <button onClick={this.props.hideMarksInTable}>Close </button>
                    </div>
                    {this.props.children}

                </div>
            </div>
        );
    }
}


export default StudentMarksInTable;