import React, { Component } from 'react';
import MyTeacherSubjectsModal from '../common/MyTeacherSubjectsModal';
import '../../style/common/modal.css';


class GetParents extends Component {
    constructor() {
        super();
        this.state = {
            parents: [],
            parentStudents: [],
            currentParentId: null,
            reportCardDTO: null,
            reportCardDTOItems: [],
            currentStudentId: null,
            status: false,
            url: "http://localhost:54164/Images/",
            openMoreInfo: false,
        };

    }

    componentDidMount() {
        fetch('http://localhost:54164/project/parents', {
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            })
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ parents: data });
            })
            .catch(reason => console.log(reason));
    }

    getMoreParentInfo = (id) => {
        console.log('student id', id);
        let parent = this.state.parents.find(s => s.ID === id);
        console.log("parents:", parent);

        this.setState({
            openMoreInfo: true,
            parent: parent,

        });
    }

    closeInfo = () => {
        this.setState({
            parent: null,
            openMoreInfo: false,

        })
        console.log('openMoreInfo', this.state.openMoreInfo, "parent: ", this.state.parent);

    }


    updateParent = (parentId) => {
        console.log('update parent id ', parentId);
        this.props.history.push("updateParent/" + parentId);
    }

    getParentStudents = (parentId) => {
        console.log('parent id:', parentId);
        const url = 'http://localhost:54164/project/parents/' + parentId + '/students';

        this.setState({
            currentParentId: parentId,
            status: !this.state.status
        });

        fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            })
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ parentStudents: data }); //{ albumPhotos: data.slice(1, 6) }
            })
            .catch(reason => console.log(reason));
    }

    getStudentMarks = (studentId) => {
        console.log('student id:', studentId);
        const url = 'http://localhost:54164/project/marks/by-student/' + studentId + '/report-card';

        this.setState({
            currentStudentId: studentId
        });

        fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            })
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ reportCardDTO: data });
                console.log(this.state.reportCardDTO);
                this.setState({ reportCardDTOItems: this.state.reportCardDTO.Classes });
                console.log(this.state.reportCardDTOItems);
            })
            .catch(reason => console.log(reason));

    }


    render() {
        return (
            <div className="my_student_page">
                <h2>List of parents</h2>

                <ul className='getParentList'>
                    {
                        this.state.parents.map(parent =>
                            <li key={parent.ID}>
                                {parent.ID}. {parent.FirstName} {parent.LastName}

                                <button
                                    className="btn-update-withMargine"
                                    onClick={() => this.getMoreParentInfo(parent.ID)}>DETAILS</button>

                                <button
                                    className="btn-update-withMargine"
                                    onClick={() => this.updateParent(parent.ID)}>UPDATE</button>

                                <button
                                    className="btn-add-withMargine"
                                    onClick={() => this.getParentStudents(parent.ID)}>STUDENTS</button>

                                <MyTeacherSubjectsModal get={this.state.openMoreInfo} hide={this.closeInfo} >
                                    {this.state.parent &&
                                        <ul>
                                            <li>Id: {this.state.parent.ID}</li>
                                            <li>UserName: {this.state.parent.UserName}</li>
                                            <li>FirstName: {this.state.parent.FirstName}</li>
                                            <li>LastName: {this.state.parent.LastName}</li>
                                            <li>Email: {this.state.parent.Email}</li>
                                            <li>PhoneNumber: {this.state.parent.PhoneNumber}</li>

                                            <li>Jmbg: {this.state.parent.Jmbg}</li>

                                            <li>EmailConfirmed: {this.state.parent.EmailConfirmed.toString()}</li>
                                            <li>PhoneNumberConfirmed: {this.state.parent.PhoneNumberConfirmed.toString()}</li>
                                        </ul>
                                    }
                                </MyTeacherSubjectsModal>





                                {
                                    this.state.parentStudents.length > 0 && parent.ID === this.state.currentParentId &&
                                    <table>
                                        <thead>
                                            <tr><th> UserName </th><th> Img </th><th>Student</th><th>IsActive</th><th></th></tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.parentStudents.map(student =>
                                                    <tr key={student.Id}>
                                                        <td>{student.UserName}</td>
                                                        <td><img src={this.state.url + student.ImagePath} alt="slika" width="200px" height="200px" /></td>

                                                        <td>
                                                            {student.FirstName} {student.LastName}
                                                        </td>
                                                        <td>{student.IsActive.toString()}</td>
                                                        <td><button
                                                            className="detail_btn"
                                                            onClick={() => this.getStudentMarks(student.Id)}>Marks</button>

                                                            {
                                                                student.Id === this.state.currentStudentId &&
                                                                <table>
                                                                    <thead>
                                                                        <tr><th> Subject </th><th colSpan="4"> Marks </th></tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            this.state.reportCardDTOItems.map((item, index) =>
                                                                                <tr key={index + 1} id='reportCardDTOItems'>
                                                                                    <td>
                                                                                        <b>{item.Subject}</b><br />
                                                                                        teacher: {item.Teacher}
                                                                                    </td>
                                                                                    <td>{item.FirstSemesterMarks.map((mark, indeks) =>
                                                                                        <ul key={indeks + 1}>
                                                                                            <li><a href='#' target="_blank" rel="noopener noreferrer">{mark}</a></li>
                                                                                        </ul>
                                                                                    )
                                                                                    }</td>
                                                                                    <td>{item.FirstSemesterAverageMark}</td>
                                                                                    <td>{item.SecondSemesterMarks.map((mark, indeks) =>
                                                                                        <ul key={indeks + 1}>
                                                                                            <li><a href='#' target="_blank" rel="noopener noreferrer">{mark}</a></li>
                                                                                        </ul>
                                                                                    )
                                                                                    }</td>
                                                                                    <td>{item.SeconSemesterAverageMark}</td>


                                                                                </tr>
                                                                            )
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            }

                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>

                                }


                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default GetParents;