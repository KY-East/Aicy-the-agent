import DefaultTheme from 'vitepress/theme'
import './custom.css'
import TaskList from './components/TaskList.vue'
import ProgressTracker from './components/ProgressTracker.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('TaskList', TaskList)
    app.component('ProgressTracker', ProgressTracker)
  }
}


