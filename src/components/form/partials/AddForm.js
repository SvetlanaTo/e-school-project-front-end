import React, { Component } from 'react';
import '../../../style/components/form/addForm.css';
import { FORMS, TEACHERS } from "../../../service/api";


class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Grade: 0,
            Tag: '',
            AttendingTeacherId: '',
            teachers: [],
            errorMessage: '',
            disable: true,
            error: null,
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
            const requestForTeachers = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(TEACHERS, requestForTeachers)
                .then(response => response.json())
                .then(data => {
                    this.setState({ teachers: data })
                });
        }
    }


    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }

    handleGradeChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disable: true, errorMessage: '' })
        }
        else if (target.value !== '' && (target.value < 1 || target.value > 8)) {
            this.setState({ errorMessage: 'Grade must be a number between 1 and 8.', disable: true })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value
            })
        }

    }

    handleTagChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disable: true, errorMessage: '' })
        }
        else if (target.value !== '' && target.value.length > 1) {
            this.setState({ errorMessage: "Tag must be exactly one character long.", disable: true })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value
            })
        }

    }

    handleSubmit = (event) => {
        const newGrade = this.state.Grade;
        const newTag = this.state.Tag;
        const newAttendingTeacher = this.state.teachers.find(t => t.ID === this.state.AttendingTeacherId);

        const r = window.confirm(`
        Grade: ${newGrade}
        Tag: ${newTag}
        Attending Teacher: ${newAttendingTeacher.FirstName} ${newAttendingTeacher.LastName}

        Are you sure you want to create this form?`);
        if (r === true) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    Grade: this.state.Grade,
                    Tag: this.state.Tag,
                    AttendingTeacherId: this.state.AttendingTeacherId

                })
            };

            fetch(FORMS, requestOptions)
                .then(response => {
                    if (response.ok) {
                        const r = window.confirm(`
                        Success! 
                        Do you wish to continue creating forms?`);
                        if (r === false) {
                            response.json().then(data => {
                                this.setState({ errorMessage: '' })
                                this.props.history.push("/forms");
                            });
                        }
                        else {
                            window.location.reload();
                        }
                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }))
                    }
                })
                .catch(error => console.log(error))
            event.preventDefault();
        }
        else {
            console.log('what to do?');
        }

    };


    render() {
        return (
            <div className="add_form_wrapper">
                <form onSubmit={this.handleSubmit}>

                    <input
                        type="number"
                        name="Grade"
                        placeholder="Enter Grade"
                        onChange={this.handleGradeChange} />

                    <input
                        type="text"
                        name="Tag"
                        placeholder="Enter Tag"
                        onChange={this.handleTagChange} />

                    <select
                        value={this.state.AttendingTeacherId}
                        onChange={this.handleInputChange}
                        name="AttendingTeacherId">
                        <option disabled hidden value=''>Select the Attending Teacher</option>
                        {
                            this.state.teachers.map((s) =>
                                <option value={s.ID} key={s.ID}>{s.ID}. {s.FirstName} {s.LastName}</option>
                            )
                        }

                    </select>

                    <input type="submit" value="Add" className="submit" disabled={this.state.disable} />
                    <input type="button" value="Cancel" className="formTable_btn-nop" onClick={() => this.props.history.push("/forms")} />
                    <br />
                    <label className="error">{this.state.errorMessage}</label>
                </form>
            </div>

        )
    }
};

export default AddForm;