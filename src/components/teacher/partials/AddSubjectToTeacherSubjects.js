import React, { Component } from 'react';
import '../../../style/components/auth/andjalogin.css';
import { TEACHERS, SUBJECTS, TEACHER_TO_SUBJECT } from "../../../service/api";

class AddSubjectToTeacherSubjects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTeacher: '',
            selectedTeacherId: '',
            selectedSubject: '',
            subjects: [],
            errorMessage: ''
        };
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("token");
        if (currentUser) {
            const path = TEACHERS + "/" + this.props.match.params.id;
            console.log("path to teacher: ", path);
            const requestForTeacher = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestForTeacher)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        selectedTeacher: data,
                        selectedTeacherId: this.state.selectedTeacher.ID
                    });
                    console.log('selectedTeacher:', this.state.selectedTeacher);
                });


            const requestForSubjects = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(SUBJECTS, requestForSubjects)
                .then(response => response.json())
                .then(data => {
                    this.setState({ subjects: data })
                });
            console.log('subjects:', this.state.subjects);
        } else {
            this.props.history.push("/login");
        }

    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
        console.log(name, target.value);
    }

    handleSubmit = (event) => {

        event.preventDefault();

        const selectedTeacherId = this.state.selectedTeacher.ID;
        const newSubjectId = this.state.selectedSubject;

        const r = window.confirm(`Are you sure you want to assign teacher 
        ${this.state.selectedTeacher.FirstName} ${this.state.selectedTeacher.LastName} 
        to subject ${newSubjectId} ?`);
        if (r === true) {
            const path = TEACHER_TO_SUBJECT + "/teachers/" + selectedTeacherId + "/subjects/" + newSubjectId;

            console.log(path);

            const requestOptions = {
                method: 'POST',
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
                        Do you wish to continue assigning subjects to 
                        ${this.state.selectedTeacher.FirstName} ${this.state.selectedTeacher.LastName}?`);

                        if (r === false) {
                            this.setState({ errorMessage: '' });
                            this.props.history.push("/teachers");
                        }
                        else {
                            response.json().then(data => {
                                this.setState({
                                    errorMessage: '',
                                    teacherId: data.Teacher.ID
                                })
                            });
                        }
                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }));
                    }
                })
                .catch(error => console.log(error));
        }

    }

    render() {
        return (
            <div id="fts_div">

                <div className="add_fts_wrapper">
                    <form onSubmit={this.handleSubmit} id="assignTSForm">
                        <label>
                            Pick the new subject for the teacher <b> {this.state.selectedTeacher.FirstName} {this.state.selectedTeacher.LastName}</b>:
                        <select
                                id="fts_teachers_select"
                                value={this.state.selectedSubject}
                                onChange={this.handleInputChange}
                                name="selectedSubject"
                                required >
                                <option disabled hidden value=''>Subjects...</option>
                                {
                                    this.state.subjects.map((s) =>
                                        <option value={s.ID} key={s.ID}>{s.ID}, {s.Name}, {s.Grade}, {s.NumberOfClassesPerWeek}</option>
                                    )
                                }

                            </select>
                        </label>

                        <input type="submit" value="Assign" className="submit" />
                        <input type="button" value="Cancel" className="formTable_btn-nop" onClick={() => this.props.history.push("/teachers")} />
                        <label className="error">{this.state.errorMessage}</label>

                    </form>
                </div>
            </div>
        )
    }
}

export default AddSubjectToTeacherSubjects;