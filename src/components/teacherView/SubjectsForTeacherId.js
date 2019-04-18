import React, { Component } from 'react';
import { TEACHER_TO_SUBJECT, FTS } from '../../service/api';
import "../../style/components/teacherView/teacherView.css";
import '../../style/common/table.css';
import closeIconKvadrat from '../../images/closeIconKvadrat.png';

class SubjectsForTeacherId extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacherToSubjects: [],
            teacherToSubject: null,
            subject: null,
            currentSubjectId: 0,
            formsToTeacherSubjects: [],
            expandRow: false,
            note: '',
        };
    }

    componentDidMount() {
        const currentUserId = localStorage.getItem('UserId');

        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'teacher') {
            this.props.history.push('/no-auth');
        }
        else {
            const path = TEACHER_TO_SUBJECT + "/teachers/" + currentUserId + "/subjects/";
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({ teacherToSubjects: data })
                });
        }
    }

    openFormsTable = (id) => {
        let subject = this.state.teacherToSubjects.find(ts => ts.Subject.ID === id);
        const currentUserId = localStorage.getItem('UserId');
        this.setState({
            subject: subject,
            currentSubjectId: id
        });

        console.log('subject id:', id);
        console.log("subject ", subject);

        const url = FTS + '/subjects/' + id + '/by-teacher/' + currentUserId;
        console.log(url);

        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json; charset= UTF-8'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    this.setState({
                        formsToTeacherSubjects: data,
                        expandRow: true, subject: subject, currentSubjectId: id
                    });
                }
                else {
                    this.setState({
                        formsToTeacherSubjects: data,
                        expandRow: false
                    });
                    alert(`${localStorage.getItem('name')} currently doesn't teache
                    subject ${subject.Subject.Name} 
                    in any form.`)
                }

            })
            .catch(reason => console.log(reason));
    }

    closeFormsTable = () => {
        this.setState({ subject: null, expandRow: false, note: '' })
    }

    openFTSPage = (id) => {
        this.props.history.push("form-to-teacher-subject/" + id);
        console.log("form-to-teacher-subject/" + id);

    }

    render() {

        const formHeading = ["Grade-Tag", "Attending teacher", ""];

        const buttons = [
            { name: "Forms", action: this.openFormsTable, class: "btn-neutral-xl" },
        ];

        return (
            <div className="bodies">
                <h2>{this.state.teacherToSubjects.length} subjects </h2>

                <div className="my_wrapper">
                    {
                        this.state.teacherToSubjects &&
                        <ul className="my_list_row">
                            <li>
                                <ul>
                                    <li>Name</li>
                                    <li>Grade</li>
                                    <li>Weekly classes</li>
                                    <li></li>
                                </ul>
                            </li>
                            {
                                this.state.teacherToSubjects.map(ts =>
                                    <li key={ts.ID} className="my_list_row_contant">
                                        <ul>
                                            <li>{ts.Subject.Name}</li>
                                            <li>{ts.Subject.Grade}</li>
                                            <li>{ts.Subject.NumberOfClassesPerWeek}</li>
                                            {
                                                buttons.map(btn => (
                                                    <li key={btn.name}><button className={btn.class} onClick={() => btn.action(ts.Subject.ID)}>{btn.name}</button></li>
                                                ))
                                            }


                                        </ul>
                                        {
                                            ts.Subject.ID === this.state.currentSubjectId && this.state.formsToTeacherSubjects.length > 0 && this.state.expandRow &&
                                            <div>

                                                <img src={closeIconKvadrat} width="25px" height="25px" onClick={this.closeFormsTable} className="closeIcon" />
                                                <table className="table_odeljenja_nastavnika">
                                                    <thead>
                                                        <tr>
                                                            {
                                                                formHeading.map((head, index) => <th key={index}>{head}</th>)
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.state.formsToTeacherSubjects.map(fts =>
                                                                <tr key={fts.ID} >
                                                                    <td>{fts.Form.Grade}-{fts.Form.Tag}</td>
                                                                    <td>{fts.Form.AttendingTeacher.FirstName} {fts.Form.AttendingTeacher.LastName}</td>

                                                                    <td><button onClick={() => this.openFTSPage(fts.ID)} className="btn-update">Students</button></td>
                                                                </tr>

                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>

                                        }

                                    </li>
                                )
                            }
                        </ul>

                    }



                </div>
            </div>
        )
    }
}


export default SubjectsForTeacherId;