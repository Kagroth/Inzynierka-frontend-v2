
import Vue from 'vue'
import VueRouter from 'vue-router'
import StartSite from '@/components/StartSite'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import ObtainResetPasswordLinkForm from '@/components/auth/ObtainResetPasswordLinkForm'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import GroupManager from '@/components/groups/GroupManager'
import GroupCreator from '@/components/groups/GroupCreator'
import GroupEditor from '@/components/groups/GroupEditor'
import GroupListing from '@/components/groups/GroupListing'
import Group from '@/components/groups/Group'
import TaskManager from '@/components/tasks/TaskManager'
import TaskListing from '@/components/tasks/TaskListing'
import TaskCreator from '@/components/tasks/TaskCreator'
import Task from '@/components/tasks/Task'
import ExerciseManager from '@/components/exercises/ExerciseManager'
import ExerciseListing from '@/components/exercises/ExerciseListing'
import ExerciseCreator from '@/components/exercises/ExerciseCreator'
import Exercise from '@/components/exercises/Exercise'
import TestListing from '@/components/tests/TestListing'
import Test from '@/components/tests/Test'
import TestCreator from '@/components/tests/TestCreator'
import TestManager from '@/components/tests/TestManager'
import Solution from '@/components/solutions/Solution'
import SolutionListing from '@/components/solutions/SolutionListing'
import UserData from '@/components/solutions/UserData'
import Editor from '@/components/editor/Editor'
import StudentManager from '@/components/students/StudentManager'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'StartSite',
      component: StartSite,
      children: [
        {
          path: 'students',
          name: 'Students',
          component: StudentManager,
        },
        {
          path: 'groups',
          name: 'MyGroups',
          component: GroupManager,
          children: [
            {
              path: '/',
              name: 'GroupListing',
              component: GroupListing
            },
            {
              path: 'group/:name',
              name: 'GroupDetails',
              component: Group
            },                  
            {
              path: 'newGroup',
              name: 'GroupCreator',
              component: GroupCreator,
              meta: {
                onlyTeacherAllowed: true
              },
            },
            {
              path: 'group/:name/edit',
              name: 'GroupEditor',
              component: GroupEditor,
              meta: {
                onlyTeacherAllowed: true
              },
            } 
          ]
        },
        {
          path: 'tasks',
          name: 'MyTasks',
          component: TaskManager,
          children: [
            {
              path: '/',
              name: 'TaskListing',
              component: TaskListing
            },
            {
              path: 'newTask',
              name: 'TaskCreator',
              component: TaskCreator,
              meta: {
                onlyTeacherAllowed: true
              },
            },            
            {
              path: ':pk',
              name: 'TaskDetails',
              component: Task,
              props: true
            },
          ]
        },
        {
          path: 'exercises',
          name: 'MyExercises',
          component: ExerciseManager,
          meta: {
            onlyTeacherAllowed: true
          },
          children: [            
            {
              path: '/',
              name: 'ExerciseListing',
              component: ExerciseListing
            },            
            {
              path: ':pk',
              name: 'ExerciseDetails',
              component: Exercise,
              props: true
            },             
            {
              path: 'newExercise',
              name: 'ExerciseCreator',
              component: ExerciseCreator
            },
          ]
        },
        {
          path: 'tests',
          name: "MyTests",
          component: TestManager,
          meta: {
            onlyTeacherAllowed: true
          },
          children: [
            {
              path: '/',
              name: 'TestListing',
              component: TestListing
            },
            {
              path: ':pk',
              name: 'TestDetails',
              component: Test
            },
            {
              path: 'newTest',
              name: 'TestCreator',
              component: TestCreator
            },
          ]
        },
        {
          path: 'solution/:pk',
          name: 'Solution',
          component: Solution,
        },
        {
          path: 'solutions',
          name: 'SolutionListing',
          component: SolutionListing
        },
        {
          path: 'profile/:pk',
          name: 'UserData',
          component: UserData,
          props: true
        },
        {
          path: 'email_test',
          component: () => import("@/components/EmailTest.vue")
        }        
      ]
    },    
    {
      path: '/login',
      component: LoginForm
    },    
    {
      path: '/register',
      component: RegisterForm
    },
    {
      path: '/obtain_reset_password_link',
      name: 'ObtainResetPasswordLink',
      component: ObtainResetPasswordLinkForm
    },
    {
      path: '/reset_password/:hash_string',
      name: 'ResetPasswordForm',
      component: ResetPasswordForm
    },
    {
      path: '/tasks',
      name: 'MyTasks',
      component: TaskManager,
      children: [
        {
          path: 'tasks/:pk/solution/:pks',
          name: 'Solution',
          component: Solution,
        }
      ]
    },
    {
      path: '/editor',
      name: 'Editor',
      component: Editor,
      props: true
    }
  ],
  mode: 'history'
})


router.beforeEach((to, from, next) => {
  let userTypeName = {}

  if (localStorage.getItem('profile')) {
    userTypeName = JSON.parse(localStorage.getItem('profile')).userType.name
  }

  if (to.matched.some(record => record.meta.onlyTeacherAllowed)) {
    if (userTypeName !== 'Teacher') {
      next({
        path: "/"
      })
    } else {
      next()
    }
  } else {
    next() 
  }
})

export default router