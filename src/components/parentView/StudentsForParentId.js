import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { STUDENTS, IMAGEPATH } from '../../service/api';
import "../../style/components/parentView/parentView.css";
import '../../style/common/table.css';


class StudentsForParentId extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            student: null,
            parent: null,
            note: '',
            url: IMAGEPATH,
            errorMessage: ''
        };
    }

    componentDidMount() {
        const currentUserId = localStorage.getItem('UserId');

        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'parent') {
            this.props.history.push('/no-auth');
        }
        else {
            const path = STUDENTS + "/for-parent/" + currentUserId;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        response.json().then(data => {
                            this.setState({
                                errorMessage: '',
                                students: data
                            })

                        });
                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }
    }


    openStudentPage = (id) => {
        this.props.history.push("student-profile-for-parent/" + id);
        console.log("student-profile-for-parent/" + id);

    }


    render() {
        return (

            <div className="parent_view_div">
                <h2 className="h2_parent_view_div">{this.state.students.length} students </h2>
                {
                    this.state.students &&
                    <div className="pv_students">

                        {
                            this.state.students.map(s =>
                                <div key={s.ID} className="pv_students_column">
                                    <div className="parent_student_card" onClick={() => this.openStudentPage(s.ID)}>
                                        <img src={this.state.url + s.ImagePath} alt="Avatar" width="200px" height="200px" />
                                        <div className="container">
                                            <h3>{s.FirstName}  {s.LastName}</h3>
                                        </div>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                }

            </div>

        )
    }
}


export default withRouter(StudentsForParentId); 