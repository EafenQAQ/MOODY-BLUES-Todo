<template>
    <div class="todo-list px-5">
        <div class="add-todo">
            <input class=" outline-none focus:ring-1 transition-all ease duration-150" v-model="newTodo"
                @keyup.enter="addTodo" placeholder="添加新任务..." type="text" />
            <button @click="addTodo">
                <svg width="25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M12 5v14"></path>
                        <path d="M5 12h14"></path>
                    </g>
                </svg>
            </button>
        </div>



        <task-stats :todos="todos" />

        <div class="todo-filters">
            <button @click="filter = 'all'" :class="{ active: filter === 'all' }">
                全部
            </button>
            <button @click="filter = 'active'" :class="{ active: filter === 'active' }">
                进行中
            </button>
            <button @click="filter = 'completed'" :class="{ active: filter === 'completed' }">
                已完成
            </button>
        </div>

        <div class="todo-container w-full">
            <Transition name="fade" mode="out-in">
                <div v-if="filteredTodos.length === 0" class="empty-state">
                    暂无任务显示
                </div>
                <TransitionGroup v-else class="todos" name="list" tag="div">
                    <todo-item v-for="todo in filteredTodos" :key="todo.id" :todo="todo"
                        @toggle-complete="toggleComplete" @toggle-timer="toggleTimer" @delete-todo="deleteTodo" />
                </TransitionGroup>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { NButton } from 'naive-ui'
import TodoItem from './TodoItem.vue'
import TaskStats from './TaskStats.vue'
import { showNotification, requestNotificationPermission } from '../services/notification'
import checkSound from '../assets/sound/check-sound.mp3'
import deleteSound from '../assets/sound/delete-sound.mp3'

// 声明音频

const checkAudio = new Audio(checkSound)
const deleteAudio = new Audio(deleteSound)

// 任务列表状态
const todos = ref([])
const newTodo = ref('')
const filter = ref('all') // 过滤器：'all', 'active', 'completed'

// 过滤后的任务列表
const filteredTodos = computed(() => {
    switch (filter.value) {
        case 'active':
            return todos.value.filter(todo => !todo.completed)
        case 'completed':
            return todos.value.filter(todo => todo.completed)
        default:
            return todos.value
    }
})

// 从localStorage加载数据
onMounted(() => {
    const savedTodos = localStorage.getItem('time-tracking-todos')
    if (savedTodos) {
        todos.value = JSON.parse(savedTodos)
    }

    // 请求通知权限
    requestNotificationPermission()
})

// 保存到localStorage
const saveTodos = () => {
    localStorage.setItem('time-tracking-todos', JSON.stringify(todos.value))
}

// 添加新任务
const addTodo = () => {
    if (newTodo.value.trim()) {
        const todo = {
            id: Date.now(),
            text: newTodo.value,
            completed: false,
            timeRecords: [],
            isTracking: false,
            startTime: null,
            totalTime: 0 // 总计时间（毫秒）
        }
        todos.value.push(todo)
        newTodo.value = ''
        saveTodos()
    }
}

// 切换任务完成状态
const toggleComplete = (id) => {

    checkAudio.play();
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
        // 如果任务正在计时且设为完成，停止计时
        if (todo.isTracking && !todo.completed) {
            toggleTimer(id)
        }
        todo.completed = !todo.completed

        // 如果任务标记为完成，显示通知
        if (todo.completed) {
            showNotification('任务完成', `"${todo.text}" 已完成！总耗时: ${formatTime(todo.totalTime)}`)
        }

        saveTodos()
    }
}

// 切换计时状态
const toggleTimer = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return

    if (todo.isTracking) {
        // 停止计时
        const endTime = new Date()
        const duration = endTime - todo.startTime

        // 添加一条计时记录
        todo.timeRecords.push({
            start: todo.startTime,
            end: endTime,
            duration
        })

        // 更新总时间
        todo.totalTime += duration
        todo.isTracking = false
        todo.startTime = null

        // 显示计时完成通知
        showNotification('计时结束', `"${todo.text}" 计时结束！此次耗时: ${formatTime(duration)}`)
    } else {
        // 开始计时
        todo.isTracking = true
        todo.startTime = new Date()

        // 显示开始计时通知
        showNotification('计时开始', `"${todo.text}" 开始计时`)
    }

    saveTodos()
}

// 删除任务
const deleteTodo = (id) => {
    deleteAudio.play();

    todos.value = todos.value.filter(t => t.id !== id)
    saveTodos()
}

// 格式化时间显示
const formatTime = (ms) => {
    if (!ms) return '00:00:00'

    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [hours, minutes, seconds]
        .map(v => v < 10 ? '0' + v : v)
        .join(':')
}
</script>

<style scoped>
/* CSS 样式保持不变 */

.todo-container {

    min-height: 600px;
    /* 设置固定高度，确保布局稳定 */
    max-height: 600px;
    /* 可选：限制最大高度 */

}

.todo-list {
    margin-top: 20px;
}

.add-todo {
    display: flex;
    margin-bottom: 20px;
}

.add-todo input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
}

.add-todo button {
    padding: 10px 15px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: ease all 0.2s;
}

.add-todo button:hover {
    background-color: var(--hover-color);
}

.todo-filters {
    display: flex;
    margin-bottom: 15px;
}

.todo-filters button {
    flex: 1;
    padding: 8px;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: all ease 0.3s;
}

.todo-filters button:first-child {
    border-radius: 4px 0 0 4px;
}

.todo-filters button:last-child {
    border-radius: 0 4px 4px 0;
}

.todo-filters button.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.empty-state {
    text-align: center;
    color: #666;
    padding: 20px;
    border: 1px dashed #ddd;
    border-radius: 4px;


}

.todos {
    margin-top: 20px;
}

/* transitionGroup动画 */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* 淡入效果 */
.fade-enter-from {
    opacity: 0;
}

.fade-enter-active {
    transition: opacity 0.3s ease;
    /* 可以调整过渡时长和缓动函数 */
}

.fade-enter-to {
    opacity: 1;
}

/* 淡出效果 */
.fade-leave-from {
    opacity: 1;

}

.fade-leave-active {
    transition: opacity 0.15s ease;
    /* 同样的时长和缓动函数 */


}

.fade-leave-to {
    opacity: 0;
}
</style>