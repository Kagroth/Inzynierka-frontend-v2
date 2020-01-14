
//Docelowy Router

import Vue from 'vue'
import VueRouter from 'vue-router'
import StartSite from '@/components/StartSite'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import GroupManager from '@/components/groups/GroupManager'
import GroupCreator from '@/components/groups/GroupCreator'
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
import Editor from '@/components/editor/Editor'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'StartSite',
      component: StartSite,
      children: [
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
              component: GroupCreator
            }, 
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
              component: TaskCreator
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

/*
Stockowy router z vue add router
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ /*'../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

*/
