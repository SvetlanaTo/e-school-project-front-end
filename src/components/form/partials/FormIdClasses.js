import React, { Component } from 'react';
import { FORMS, FTS } from '../../../service/api';
import '../../../style/components/form/formIdClassesPage.css';

class FormIdClasses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: [],
            formIdClasses: [],

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
            this.fetchForm(this.props.match.params.id);
            this.fetchFormIdClasses(this.props.match.params.id);
        }
    }

    fetchForm = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer  ' + localStorage.getItem("token")
            }
        };
        const path = FORMS + "/" + id;
        console.log(path)
        fetch(path, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data =>
                        this.setState({ form: data })
                    )
                } else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
    }

    fetchFormIdClasses = (id) => {
        const url = FTS + "/by-form/" + id;
        console.log(url);

        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ formIdClasses: data });

            })
            .catch(reason => console.log(reason));

    }

    assignClass = (id) => {

        console.log('usli u assignClass to form id ', id);
        this.props.history.push("addClassesToForm/" + id);
    }

    removeClass = (id) => {

        const formID = this.state.form.ID;

        let formIdClass = this.state.formIdClasses.find(f => f.ID === id);
        console.log(formIdClass)

        const r = window.confirm(`
Are you sure you want to remove this class?`);

        if (r === true) {
            const path = FTS + "/" + id + "/stopped-to-now";
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Success!");
                        this.fetchFormIdClasses(formID);
                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }
    }

    render() {

        const formIdClasses = ["Subject", "Grade", "Teacher", "Weekly classes", "Started", "Stopped", ""];

        return (
            <div className="formIdClassesPage">
                <div className='mysubject_body_addLinks'>


                </div>

                <h2>Form: {this.state.form.Grade}-{this.state.form.Tag}</h2>

                <div className="formId_wrapper">

                    {this.state.form && this.state.formIdClasses.length === 0 ?
                        <div className="myteachermodal_colums_row">
                            <label className="myteachermodal_colums_row_c1"><b>Classes list is empty</b></label>
                            <button className="myteachermodal_colums_row_c1, myteachermodalbtn-update" onClick={() => this.assignClass(this.state.form.ID)}>ASSIGN</button>
                        </div>
                        :

                        <div className="myteachermodal_colums_row">
                            <h3 className="myteachermodal_colums_row_c2">{this.state.formIdClasses.length} teachers </h3>
                            <button className="myteachermodal_colums_row_c2, myteachermodalbtn-update" onClick={() => this.assignClass(this.state.form.ID)}>ASSIGN</button>

                        </div>
                    }

                    <table>
                        <thead>
                            <tr>
                                {
                                    formIdClasses.map((head, index) => <th key={index}>{head}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.form && this.state.formIdClasses.map(item =>

                                    <tr key={item.ID}>
                                        <td>{item.TeacherToSubject.Subject.Name}</td>
                                        <td>{item.TeacherToSubject.Subject.Grade}</td>
                                        <td>{item.TeacherToSubject.Teacher.FirstName} {item.TeacherToSubject.Teacher.LastName}</td>
                                        <td>{item.TeacherToSubject.Subject.NumberOfClassesPerWeek}</td>
                                        <td>{item.Started}</td>
                                        <td>{item.Stopped}</td>
                                        <td><button className="btn-update" onClick={() => this.removeClass(item.ID)}>Remove</button></td>

                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                </div>
            </div>
        )
    }
};

export default FormIdClasses;