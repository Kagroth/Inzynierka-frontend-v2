/*
Docelowy Router
import Vue from 'vue'
import Router from 'vue-router'
import StartSite from '@/components/StartSite'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import GroupManager from '@/components/GroupManager'
import GroupListing from '@/components/GroupListing'
import GroupCreator from '@/components/GroupCreator'
import GroupEditor from '@/components/GroupEditor'
import Group from '@/components/Group'
import TaskManager from '@/components/TaskManager'
import TaskListing from '@/components/TaskListing'
import TaskCreator from '@/components/TaskCreator'
import Task from '@/components/Task'
import ExerciseListing from '@/components/ExerciseListing'
import ExerciseCreator from '@/components/ExerciseCreator'
import Exercise from '@/components/Exercise'
import TestListing from '@/components/TestListing'
import Test from '@/components/Test'
import TestCreator from '@/components/TestCreator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: StartSite
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
      path: '/groups',
      name: '/MyGroups',
      component: GroupManager,
      children: [
        {
          path: 'groups',
          name: 'GroupListing',
          component: GroupListing
        },
        {
          path: 'group/:name',
          name: 'GroupDetails',
          component: Group
        },
        {
          path: 'group/:name/edit',
          name: 'GroupEditor',
          component: GroupEditor
        },
        {
          path: 'newGroup',
          name: 'GroupCreator',
          component: GroupCreator
        }
      ]
    },
    {
      path: '/tasks',
      name: 'MyTasks',
      component: TaskManager,
      children: [
        {
          path: 'tasks',
          name: 'TaskListing',
          component: TaskListing
        },
        {
          path: 'tasks/:pk',
          name: 'TaskDetails',
          component: Task
        },
        {
          path: 'newTask',
          component: TaskCreator
        },
        {
          path: 'exercises',
          component: ExerciseListing
        },
        {
          path: 'newExercise',
          component: ExerciseCreator
        },
        {
          path: 'exercise/:pk',
          name: 'ExerciseDetails',
          component: Exercise
        },        
        {
          path: 'tests',
          component: TestListing
        },
        {
          path: 'tests/:pk',
          name: 'TestDetails',
          component: Test
        },
        {
          path: 'newTest',
          component: TestCreator
        }
      ]
    }
  ],
  mode: 'history'
})
*/

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
