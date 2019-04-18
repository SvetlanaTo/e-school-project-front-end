import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SUBJECTS, TEACHER_TO_SUBJECT } from '../../service/api';
import MyTeacherSubjectsModal from '../common/MyTeacherSubjectsModal';
import '../../style/components/subject/mysubject.css';
import '../../style/common/table.css';

class Subject extends Component {
    constructor(props) {
        super(props);
        this.searchedGrade = React.createRef();
        this.searchedName = React.createRef();
        this.searchedWeeklyClasses = React.createRef();

        this.state = {
            subjects: [],
            openDialog: false,
            subject: null,
            teachers: [],
            note: ''
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
            this.fetchSubjects();
        }
    }

    fetchSubjects = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer  ' + localStorage.getItem("token")
            }
        };
        fetch(SUBJECTS, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data =>
                        this.setState({ subjects: data.reverse() })
                    )
                } else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
    }

    openDetails = (id) => {
        let subject = this.state.subjects.find(s => s.ID === id);
        this.setState({ openDialog: true, subject: subject });

        console.log('subject id:', id);
        const url = 'http://localhost:54164/project/teachers-to-subjects/subjects/' + id + '/teachers';

        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json; charset= UTF-8'
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ teachers: data });
            })
            .catch(reason => console.log(reason));
    }

    closeDetails = () => {
        this.setState({ subject: null, openDialog: false, note: '' })
    }

    updateSubject = (id) => {
        this.props.history.push("updateSubject/" + id);
    }

    deleteSubject = (id) => {

        let subjectToDelete = this.state.subjects.find(f => f.ID === id);
        const r = window.confirm(`
        
        Name: ${subjectToDelete.Name}
        Grade: ${subjectToDelete.Grade}
        Weekly classes: ${subjectToDelete.NumberOfClassesPerWeek} 

        Are you sure you want to delete this subject?`);
        if (r === true) {

            const path = SUBJECTS + "/" + id;
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json; charset= UTF-8'
                }
            };
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        this.setState({ subjects: this.state.subjects.filter(subject => subject.ID !== id) })
                        alert('The subject has been successfully deleted!');

                    }
                    else {
                        response.text().then(message => {
                            alert(message)

                            const r = window.confirm(`
                        Do you wish to unassign all teachers from this subject 
                        by stopping teaching engagement ?

        Name: ${subjectToDelete.Name}
        Grade: ${subjectToDelete.Grade}
        Weekly classes: ${subjectToDelete.NumberOfClassesPerWeek} 

        `);

                            if (r === true) {
                                const path = TEACHER_TO_SUBJECT + "/by-subject/" + id + "/stopped-teaching-to-now";
                                const requestOptions = {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                                        'Content-Type': 'application/json; charset= UTF-8'
                                    }
                                };

                                fetch(path, requestOptions)
                                    .then(response => {
                                        if (response.ok) {
                                            alert('Success!');
                                        } else {
                                            response.text().then(message => alert(message))
                                        }
                                    })
                                    .catch(error => console.log(error));

                            }
                        });
                    }
                })
                .catch(error => console.log(error))
        }
    }

    searchSubjects = (event) => {
        console.log(`da li je ocitano? 
        ${this.searchedName.current.value}
        ${this.searchedGrade.current.value}
        ${this.searchedWeeklyClasses.current.value} `);

        event.preventDefault();

        let originalSubjectList = this.state.subjects;
        let newList = [];

        if (this.searchedName.current.value !== ""
            && this.searchedGrade.current.value === ""
            && this.searchedWeeklyClasses.current.value === "") {
            console.log('if')
            newList = this.state.subjects.filter(f => {

                const lc = f.Name.toLowerCase();
                const filter = this.searchedName.current.value.toLowerCase();
                return lc.includes(filter);
            })
            this.setState({
                subjects: newList
            });
        }
        else if (this.searchedName.current.value === ""
            && this.searchedGrade.current.value !== ""
            && this.searchedWeeklyClasses.current.value === "") {
            console.log('else if2')
            newList = this.state.subjects.filter(f => f.Grade.toString() === this.searchedGrade.current.value)
            this.setState({
                subjects: newList
            });
        }
        else if (this.searchedName.current.value === ""
            && this.searchedGrade.current.value === ""
            && this.searchedWeeklyClasses.current.value !== "") {
            console.log('else if3')
            newList = this.state.subjects.filter(f => f.NumberOfClassesPerWeek.toString() === this.searchedWeeklyClasses.current.value)
            this.setState({
                subjects: newList
            });
        }

        else if (this.searchedName.current.value !== ""
            && this.searchedGrade.current.value !== ""
            && this.searchedWeeklyClasses.current.value === "") {
            console.log('else if4')

            newList = this.state.subjects.filter(f => {

                const gr = f.Grade.toString();
                const filter1 = this.searchedGrade.current.value;
                const lc = f.Name.toLowerCase();
                const filter2 = this.searchedName.current.value.toLowerCase();
                return (lc.includes(filter2) && gr === filter1);
            })
            this.setState({
                subjects: newList
            });
        }
        else if (this.searchedName.current.value === ""
            && this.searchedGrade.current.value !== ""
            && this.searchedWeeklyClasses.current.value !== "") {
            console.log('else if5')

            newList = this.state.subjects.filter(f => {

                const gr = f.Grade.toString();
                const filter1 = this.searchedGrade.current.value;
                const wc = f.NumberOfClassesPerWeek.toString();
                const filter2 = this.searchedWeeklyClasses.current.value;

                return (gr.includes(filter1) && wc.includes(filter2));
            })

            this.setState({
                subjects: newList
            });
        }
        else if (this.searchedName.current.value !== ""
            && this.searchedGrade.current.value === ""
            && this.searchedWeeklyClasses.current.value !== "") {
            console.log('else if6')

            newList = this.state.subjects.filter(f => {

                const lc = f.Name.toLowerCase();
                const filter2 = this.searchedName.current.value.toLowerCase();
                const wc = f.NumberOfClassesPerWeek.toString();
                const filter1 = this.searchedWeeklyClasses.current.value;

                return (lc.includes(filter2) && wc.includes(filter1));
            })
            this.setState({
                subjects: newList
            });
        }
        else if (this.searchedName.current.value !== ""
            && this.searchedGrade.current.value !== ""
            && this.searchedWeeklyClasses.current.value !== "") {
            console.log('else if7')

            newList = this.state.subjects.filter(f => {

                const gr = f.Grade.toString();
                const filter1 = this.searchedGrade.current.value;
                const lc = f.Name.toLowerCase();
                const filter2 = this.searchedName.current.value.toLowerCase();
                const wc = f.NumberOfClassesPerWeek.toString();
                const filter3 = this.searchedWeeklyClasses.current.value;

                return (lc.includes(filter2) && gr.includes(filter1) && wc.includes(filter3));
            })
            this.setState({
                subjects: newList
            });
        }
        else {
            console.log('else')
            newList = originalSubjectList;
            this.setState({
                subjects: newList
            });
        }
    }

    resetSearch = () => {
        this.fetchSubjects();

        this.searchedGrade.current.value = '';
        this.searchedName.current.value = "";
        this.searchedWeeklyClasses.current.value = "";
    }



    removeTeacher = (id) => {
        const subjectId = this.state.subject.ID;
        console.log(subjectId);


        const r = window.confirm(`
Are you sure you want to unassign 
this teacher from teaching
${this.state.subject.Name} for ${this.state.subject.Grade}. grade ?`);

        if (r === true) {
            const path = TEACHER_TO_SUBJECT + "/teacher/" + id + "/subject/" + this.state.subject.ID + "/stopped-teaching-now";
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
                        this.fetchTeachers(subjectId);

                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }
    }

    fetchTeachers = (id) => {
        let subject = this.state.subjects.find(t => t.ID === id);
        this.setState({
            openDialog: true,
            subject: subject
        });
        const subjectId = id;
        console.log('subjectId:', id);
        const url = 'http://localhost:54164/project/teachers-to-subjects/subjects/' + id + '/teachers';

        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({ teachers: json });
                console.log("subject id: ", subjectId, "teachers: ", this.state.teachers);
            })
            .catch(reason => console.log(reason));
    }

    render() {

        const heading = ["Id", "Name", "Grade", "Weekly classes", "", "", ""];
        const teacherHeading = ["First name", "Last name", "Started", "Stopped", ""];
        const buttons = [
            { name: "Teachers", action: this.openDetails, class: "formTable_btn-neutral" },
            { name: "Update", action: this.updateSubject, class: "btn-update" },
            { name: "Delete", action: this.deleteSubject, class: "formTable_btn-delete" }];

        return (
            <div className="mysubject_body">
                <div className='mysubject_body_addLinks'>
                    <Link to="/addSubject"><button className='mysubjectTable_btn-add-xl1'>NEW SUBJECT</button></Link>
                    <br />
                    <Link to="/assignTeacherToSubject"><button className='mysubjectTable_btn-add-xl2'>Assign teacher to subject to forms</button></Link>

                </div>

                <h2 id="h2_mysubject_body"> {this.state.subjects.length} subjects </h2>
                <div className="mysubject_wrapper">

                    <MyTeacherSubjectsModal get={this.state.openDialog} hide={this.closeDetails}>

                        {this.state.teachers.length === 0 ?
                            <div className="myteachermodal_colums_row">
                                <label className="myteachermodal_colums_row_c1"><b>Teachers list is empty</b></label>
                            </div>
                            :

                            <div className="myteachermodal_colums_row">
                                <h4 className="myteachermodal_colums_row_c2">{this.state.teachers.length} teachers </h4>

                            </div>
                        }


                        <table>
                            <thead>
                                <tr>
                                    {
                                        teacherHeading.map((head, index) => <th key={index}>{head}</th>)
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.subject && this.state.teachers.map(item =>
                                        <tr key={item.Teacher.ID}>
                                            <td>{item.Teacher.FirstName}</td>
                                            <td>{item.Teacher.LastName}</td>
                                            <td>{item.StartedTeaching}</td>
                                            <td>{item.StoppedTeaching}</td>
                                            <td><button className="btn-update" onClick={() => this.removeTeacher(item.Teacher.ID)}>Remove</button></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </MyTeacherSubjectsModal>
                    {
                        this.state.subjects &&
                        <div>
                            <form onSubmit={this.searchSubjects} className='mysubject_search_header'>
                                <label id="mysubject_search_input3">Search subjects </label>
                                <input
                                    type="text"
                                    id="mysubject_search_input5"
                                    placeholder="by name"
                                    ref={this.searchedName}
                                />

                                <input
                                    type="number"
                                    id="mysubject_search_input4"
                                    placeholder="by grade"
                                    ref={this.searchedGrade}
                                />

                                <input
                                    type="number"
                                    id="mysubject_search_input1"
                                    placeholder="by weekly classes"
                                    ref={this.searchedWeeklyClasses}
                                />
                                <input type="submit" value="Find" id="mysubject_search_button1" />
                                <button onClick={this.resetSearch} className="btn-cancel"> RESET </button>
                            </form>

                            <table id="mysubject_table_id">
                                <thead id="mysubject_t_header">
                                    <tr>
                                        {heading.map((head, index) =>
                                            <th key={index}>{head}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.subjects.map(subject =>
                                            <tr key={subject.ID}>
                                                <td>{subject.ID}</td>
                                                <td>{subject.Name}</td>
                                                <td>{subject.Grade}</td>
                                                <td>{subject.NumberOfClassesPerWeek}</td>
                                                {
                                                    buttons.map(btn => (
                                                        <td key={btn.name} id="cells_for_buttons"><button className={btn.class} onClick={() => btn.action(subject.ID)}>{btn.name}</button></td>
                                                    ))
                                                }
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

export default Subject;