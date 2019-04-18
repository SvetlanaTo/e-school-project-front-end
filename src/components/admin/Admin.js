import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ADMINS } from '../../service/api';
import Modal from '../common/Modal';
import MyStudentMarksModal from '../common/MyStudentMarksModal';
import '../../style/components/student/student.css';

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            admins: [],
            admin: null,
            openMoreInfo: false,
            errorMessage: '',
        };
    }

    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');

        }
        else {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };

            fetch(ADMINS, requestOptions)
                .then(response => {
                    if (response.ok) {
                        response.json().then(data =>
                            this.setState({ admins: data.reverse() })
                        )
                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error));
        }
    }

    getMoreAdminInfo = (id) => {
        console.log('student id', id);
        let admin = this.state.admins.find(s => s.Id === id);
        console.log("admin:", admin);

        this.setState({
            openMoreInfo: true,
            admin: admin,

        });
    }

    closeInfo = () => {
        this.setState({
            admin: null,
            openMoreInfo: false,

        })
        console.log('openMoreInfo', this.state.openMoreInfo, "admin: ", this.state.admin);

    }

    deleteAdmin = (id) => {
        let admin = this.state.admins.find(s => s.Id === id);
        const r = window.confirm(`Are you sure you want to delete admin ${admin.FirstName} ${admin.LastName}?`);
        if (r === true) {
            const path = ADMINS + "/" + id;
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Success!");
                        this.setState({ admins: this.state.admins.filter(admin => admin.Id !== id) })
                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }
    }

    updateAdmin = (id) => {
        console.log('student id:', id);
        this.props.history.push("updateAdmin/" + id);
    }


    render() {


        const heading = ["Id", "UserName", "FirstName", "LastName", "", "", ""];

        return (
            <div className="my_student_page">

                <div className='my_student_page_NoaddLinks'>
                    {/* background img */}
                </div>

                <h2 className="my_student_h2"> {this.state.admins.length} admins </h2>

                <div className="my_student_content">
                    <Modal show={this.state.openMoreInfo} onClose={this.closeInfo}>
                        {this.state.admin &&
                            <ul>
                                <li>Id: {this.state.admin.Id}</li>
                                <li>UserName: {this.state.admin.UserName}</li>
                                <li>FirstName: {this.state.admin.FirstName}</li>
                                <li>LastName: {this.state.admin.LastName}</li>
                                <li>Email: {this.state.admin.Email}</li>
                                <li>PhoneNumber: {this.state.admin.PhoneNumber}</li>

                                <li>Jmbg: {this.state.admin.Jmbg}</li>

                                <li>EmailConfirmed: {this.state.admin.EmailConfirmed.toString()}</li>
                                <li>PhoneNumberConfirmed: {this.state.admin.PhoneNumberConfirmed.toString()}</li>
                            </ul>
                        }
                    </Modal>

                    {
                        this.state.admins &&

                        <div>

                            <table id="mystudent_table_id">
                                <thead id="mystudent_t_header">
                                    <tr>
                                        {heading.map((head, index) =>
                                            <th key={index}>{head}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>


                                    {this.state.admins.map(admins =>

                                        <tr key={admins.Id}>
                                            <td id="mystudents_td">{admins.Id}</td>
                                            <td id="mystudents_td">{admins.UserName}</td>
                                            <td id="mystudents_td">{admins.FirstName}</td>
                                            <td id="mystudents_td">{admins.LastName} </td>


                                            <td id="cells_for_buttons_student"><button className="btn-add" onClick={() => this.getMoreAdminInfo(admins.Id)}>Details</button></td>
                                            <td id="cells_for_buttons_student"><button className="btn-update" onClick={() => this.updateAdmin(admins.Id)}>UPDATE</button></td>

                                            <td id="cells_for_buttons_student"><button className="formTable_btn-delete" onClick={() => this.deleteAdmin(admins.Id)}>DELETE</button></td>

                                        </tr>
                                    )
                                    }
                                </tbody>
                            </table>
                        </div>
                    }

                </div>
            </div>

        )
    }
};

export default Admin;






