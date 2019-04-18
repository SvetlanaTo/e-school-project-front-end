import React, { Component } from 'react';
import '../../../style/components/form/addForm.css';
import { FORMS, STUDENTS } from "../../../service/api";

class AddStudentToForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStudent: null,
            selectedStudentId: '',
            selectedForm: null,
            selectedFormId: 0,
            students: [],
            forms: [],
            errorMessage: '',
            disable: true,
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
            const path = STUDENTS;
            console.log("path to students: ", path);
            const requestForStudents = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestForStudents)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        students: data,
                    });
                    console.log('students:', this.state.students);
                });

            const path1 = FORMS;
            console.log("path to forms: ", path1);

            const requestForForms = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(path1, requestForForms)
                .then(response => response.json())
                .then(data => {
                    this.setState({ forms: data })
                });
            console.log('forms:', this.state.forms);
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }

    handleSubmit = (event) => {
        console.log('CIJI JE OVO id: ', event.target.value);
        console.log(this.state.selectedFormId, this.state.selectedStudentId);

        const selectedSId = this.state.selectedStudentId;
        const sFId = this.state.selectedFormId;

        const r = window.confirm(`
        Are you sure?`);

        if (r === true) {

            console.log('usli')
            const path = FORMS + "/" + sFId + "/students/" + selectedSId;
            console.log(path);

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },
            }

            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {

                        const r = window.confirm(`
                        Success! 
                        Do you wish to continue assigning students to forms?`);
                        if (r === false) {
                            this.setState({ errorMessage: '' });
                            this.props.history.push("/forms");
                        }
                        else {
                            window.location.reload();
                        }

                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }));
                    }
                })
                .catch(error => console.log(error));

            event.preventDefault();
        }

    }

    render() {
        return (
            <div className="add_form_wrapper">


                <form onSubmit={this.handleSubmit}>
                    {this.state.students &&
                        <label>
                            Select Student:
                    <select
                                value={this.state.selectedStudentId}
                                onChange={this.handleInputChange}
                                name="selectedStudentId">
                                <option value=''>Students</option>
                                {
                                    this.state.students.map((s) =>
                                        <option value={s.ID} key={s.ID}>{s.ID}. {s.FirstName} {s.LastName}</option>
                                    )

                                }

                            </select>
                        </label>
                    }
                    {this.state.forms &&
                        <label>
                            Select a new form for the student:
                    <select
                                value={this.state.selectedFormId}
                                onChange={this.handleInputChange}
                                name="selectedFormId">
                                <option value=''>Forms</option>
                                {
                                    this.state.forms.map((f) =>
                                        <option value={f.ID} key={f.ID}>{f.ID}. {f.Grade}-{f.Tag}, {f.AttendingTeacher.FirstName} {f.AttendingTeacher.LastName}</option>
                                    )

                                }

                            </select>
                        </label>

                    }

                    <input type="submit" value="Add" className="submit" />
                    <input type="button" value="Cancel" className="formTable_btn-nop" onClick={() => this.props.history.push("/forms")} />
                    <br />
                    <label className="error">{this.state.errorMessage}</label>
                </form>

            </div>

        )

    }

}
export default AddStudentToForm;