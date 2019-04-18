import React, { Component } from 'react';
import '../../../style/components/subject/assignTS_FTS.css';
import { TEACHERS, SUBJECTS, TEACHER_TO_SUBJECT, FORMS, FTS } from "../../../service/api";

class AssignTeacherToSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTeacher: null,
            selectedTeacherId: '',
            selectedSubject: null,
            selectedSubjectId: '',
            selectedForm: null,
            selectedFormId: '',
            teachers: [],
            subjects: [],
            forms: [],
            errorMessage: '',
            disable: true,
            isFTSOpen: true,
            isFormInputDisabled: true,
            isSubjectInputDisabled: false,
            isTeacherInputDisabled: false,
            newFTS: null,
            newTS: null,
            newFTSFormID: 0,
            newFTSSubjectID: 0,
            newFTSTeacherID: '',
            newTSSubjectID: 0,
            newTSTeacherID: '',
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
            const path = TEACHERS;
            console.log("path to TEACHERS: ", path);
            const requestForTeachers = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestForTeachers)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        teachers: data,
                    });
                    console.log('teachers:', this.state.teachers);
                });

            const path1 = SUBJECTS;
            console.log("path to SUBJECTS: ", path1);

            const requestForSubjects = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(path1, requestForSubjects)
                .then(response => response.json())
                .then(data => {
                    this.setState({ subjects: data })
                });
            console.log('subjects:', this.state.subjects);

            const path2 = FORMS;
            console.log("path to FORMS: ", path2);

            const requestForForms = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(path2, requestForForms)
                .then(response => response.json())
                .then(data => {
                    this.setState({ forms: data })
                });
            console.log('forms:', this.state.forms);
        }
    }

    openTS = () => {
        console.log('usli u opents');
        this.setState({
            isTSOpen: true,
            isFTSOpen: false
        });
    }

    openFTS = () => {
        console.log('usli u openFts');
        this.setState({
            isTSOpen: false,
            isFTSOpen: true
        });
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });

        console.log(name, target.value)
    }

    handleSubmitTS = (event) => {
        console.log('CIJI JE OVO id: ', event.target.value);
        console.log(this.state.selectedTeacherId, this.state.selectedSubjectId);

        const tId = this.state.selectedTeacherId;
        const sId = this.state.selectedSubjectId;

        const r = window.confirm(`
        Are you sure?`);

        if (r === true) {
            console.log('usli')
            const path = TEACHER_TO_SUBJECT + "/teachers/" + tId + "/subjects/" + sId;
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
                        Do you wish to continue assigning teachers to subjects?`);
                        if (r === false) {
                            this.setState({ errorMessage: '' });
                            this.props.history.push("/subjects");
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

    handleSubmitFTS = (event) => {
        event.preventDefault();
        const tId = this.state.selectedTeacherId;
        const sId = this.state.selectedSubjectId;


        if (this.state.isFormInputDisabled === true) {
            const r = window.confirm(`
            Are you sure?`);

            if (r === true) {
                console.log('usli')
                const path = TEACHER_TO_SUBJECT + "/teachers/" + tId + "/subjects/" + sId;
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
                            Do you wish to assigning this teacher subject combination to
                            a form?`);
                            if (r === false) {
                                this.setState({ errorMessage: '' });
                                window.location.reload();
                            }
                            else {
                                response.json().then(data => {
                                    this.setState({
                                        errorMessage: '',
                                        newTS: data,
                                        newTSTeacherID: data.Teacher.ID,
                                        newTSSubjectID: data.Subject.ID,
                                        isFormInputDisabled: false,
                                        isSubjectInputDisabled: true,
                                        isTeacherInputDisabled: true,
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
        else {
            const fId = this.state.selectedFormId;

            console.log(this.state.selectedFormId, this.state.selectedTeacherId, this.state.selectedSubjectId);

            const r = window.confirm(`
            Are you sure?`);

            if (r === true) {
                const path = FTS + "/form/" + fId + "/teacher/" + tId + "/subject/" + sId;
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
                            Do you wish to continue assigning teachers to subjects?`);

                            if (r === false) {
                                this.setState({
                                    errorMessage: '',
                                    selectedFormId: '',
                                    selectedSubjectId: '',
                                    selectedTeacherId: ''
                                });
                                window.location.reload();
                            }
                            else {
                                response.json().then(data => {
                                    this.setState({
                                        errorMessage: '',
                                        newFTS: data,
                                        newFTSTeacherID: data.TeacherToSubject.Teacher.ID,
                                        newFTSSubjectID: data.TeacherToSubject.Subject.ID,
                                        newFTSFormID: data.Form.ID,
                                        isFormInputDisabled: true,
                                        isSubjectInputDisabled: false,
                                        isTeacherInputDisabled: false,
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


    }

    render() {
        return (
            <div id="fts_div">
                <div id="toggle_div">
                </div>
                {
                    this.state.teachers && this.state.subjects && this.state.isFTSOpen &&
                    <div className="add_fts_wrapper">

                        <form onSubmit={this.handleSubmitFTS}>

                            <select
                                id="fts_teachers_select"
                                value={this.state.selectedTeacherId}
                                onChange={this.handleInputChange}
                                name="selectedTeacherId"
                                disabled={this.state.isTeacherInputDisabled}
                                required >
                                <option value=''>Select teacher</option>
                                {
                                    this.state.teachers.map((s) =>
                                        <option value={s.ID} key={s.ID}>{s.ID}. {s.FirstName} {s.LastName}</option>
                                    )

                                }

                            </select>

                            <select
                                id="fts_subject_select"
                                value={this.state.selectedSubjectId}
                                onChange={this.handleInputChange}
                                name="selectedSubjectId"
                                disabled={this.state.isSubjectInputDisabled}
                                required >
                                <option value=''>Select subject</option>
                                {
                                    this.state.subjects.map((f) =>
                                        <option value={f.ID} key={f.ID}>{f.ID}. {f.Name} for {f.Grade}.grade, {f.NumberOfClassesPerWeek}cpw</option>
                                    )

                                }

                            </select>
                            {this.state.forms &&
                                <select id="fts_form_select"
                                    value={this.state.selectedFormId}
                                    onChange={this.handleInputChange}
                                    name="selectedFormId"
                                    disabled={this.state.isFormInputDisabled}
                                    required >
                                    <option value=''>Select form</option>
                                    {
                                        this.state.forms.map((f) =>
                                            <option value={f.ID} key={f.ID}>{f.ID}. {f.Grade}-{f.Tag}, {f.AttendingTeacher.FirstName} {f.AttendingTeacher.LastName}</option>
                                        )

                                    }

                                </select>
                            }
                            <input type="submit" value="Add" className="submit" />
                            <input type="button" value="Cancel" className="formTable_btn-nop" onClick={() => this.props.history.push("/subjects")} />
                            <br />
                            <label className="error">{this.state.errorMessage}</label>


                        </form>
                    </div>
                }

            </div>
        )

    }

}
export default AssignTeacherToSubject;
