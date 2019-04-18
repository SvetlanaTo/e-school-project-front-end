import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import NotFound from './components/common/NotFound';
import NotAuth from './components/common/NotAuth';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import RegisterAdmin from './components/auth/RegisterAdmin';

import Form from './components/form/Form';
import UpdateForm from './components/form/partials/UpdateForm';
import AddForm from './components/form/partials/AddForm';
import AddStudentToForm from './components/form/partials/AddStudentToForm';
import FormIdClasses from "./components/form/partials/FormIdClasses";
import AddClassesToForm from "./components/form/partials/AddClassesToForm";

import Teacher from './components/teacher/Teacher';
import UpdateTeacher from './components/teacher/partials/UpdateTeacher';
import RegisterTeacher from './components/auth/RegisterTeacher';
import AddSubjectToTeacherSubjects from './components/teacher/partials/AddSubjectToTeacherSubjects';

import Subject from './components/subject/Subject';
import UpdateSubject from './components/subject/partials/UpdateSubject';
import AddSubject from './components/subject/partials/AddSubject';
import AssignTeacherToSubject from './components/subject/partials/AssignTeacherToSubject';

// for teacher view
import SubjectsForTeacherId from './components/teacherView/SubjectsForTeacherId';
import FormToTeacherSubjectId from './components/teacherView/FormToTeacherSubjectId';
import UpdateStudentMarks from './components/teacherView/UpdateStudentMarks';

import Student from './components/student/Student';
import UpdateStudent from './components/student/partials/UpdateStudent';
import RegisterStudentAndParent from './components/auth/RegisterStudentAndParent';
import StudentId from './components/student/partials/StudentId';

import FileUploader from './components/album/FileUploader';
import GetParents from './components/album/GetParents';
import ParentComponent from './components/album/ParentComponent';

//for parent view
import StudentsForParentId from './components/parentView/StudentsForParentId';
import StudentIdForParentId from './components/parentView/StudentIdForParentId';

//for student view
import StudentIdProfile from './components/studentView/StudentIdProfile';
import Logger0 from './components/logger/Logger0';
import Logger1 from './components/logger/Logger1';
import Logger2 from './components/logger/Logger2';
import UpdateParent from './components/album/UpdateParent';
import Admin from './components/admin/Admin';
import UpdateAdmin from './components/admin/UpdateAdmin';


class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Header></Header>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Home} />

            <Route exact path="/register-admin" component={RegisterAdmin} />
            <Route exact path="/admins" component={Admin} />
            <Route exact path="/updateAdmin/:id" component={UpdateAdmin} />

            {/* form */}
            <Route exact path="/forms" component={Form} />
            <Route exact path="/updateForm/:id" component={UpdateForm} />
            <Route exact path="/addForm" component={AddForm} />
            <Route exact path="/addStudentToForm" component={AddStudentToForm} />
            <Route exact path="/formClasses/:id" component={FormIdClasses} />
            <Route exact path="/formClasses/addClassesToForm/:id" component={AddClassesToForm} />


            {/* teacher */}
            <Route exact path="/teachers" component={Teacher} />
            <Route exact path="/updateTeacher/:id" component={UpdateTeacher} />
            <Route exact path="/register-teacher" component={RegisterTeacher} />
            <Route exact path="/assign-subject-to-teacher/:id" component={AddSubjectToTeacherSubjects} />


            {/* subject */}
            <Route exact path="/subjects" component={Subject} />
            <Route exact path="/updateSubject/:id" component={UpdateSubject} />
            <Route exact path="/addSubject" component={AddSubject} />
            <Route exact path="/assignTeacherToSubject" component={AssignTeacherToSubject} />

            {/* student */}

            <Route exact path="/students" component={Student} />
            <Route exact path="/updateStudent/:id" component={UpdateStudent} />
            <Route exact path="/register-student-and-parent" component={RegisterStudentAndParent} />
            <Route exact path="/studentProfile/:id" component={StudentId} />

            {/* for teacher view */}
            <Route exact path="/subjects-for-teacher" component={SubjectsForTeacherId} />
            <Route exact path="/form-to-teacher-subject/:ftsId/student/:studentId" component={UpdateStudentMarks} />
            {/* fts - for teacher view*/}
            <Route exact path="/form-to-teacher-subject/:id" component={FormToTeacherSubjectId} />

            {/* parent view */}
            <Route exact path="/students-for-parent" component={StudentsForParentId} />
            <Route exact path="/student-profile-for-parent/:id" component={StudentIdForParentId} />

            {/* studentView */}
            <Route exact path="/my-profile" component={StudentIdProfile} />

            {/* parent-student-album */}
            <Route exact path="/parents-album" component={GetParents} />
            <Route exact path="/updateParent/:id" component={UpdateParent} />
            <Route exact path="/file-uploader" component={FileUploader} />
            <Route exact path="/expand-table" component={ParentComponent} />

            {/* logger */}
            <Route exact path="/logger-today" component={Logger0} />
            <Route exact path="/logger-yesterday" component={Logger1} />
            <Route exact path="/logger-2days-ago" component={Logger2} />

            <Route exact path="/no-auth" component={NotAuth} />
            <Route component={NotFound} />
          </Switch>
          <Footer></Footer>
        </Fragment>
      </Router>
    );
  }
}

export default App;