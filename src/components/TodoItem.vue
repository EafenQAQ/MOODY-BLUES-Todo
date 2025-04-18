<template>
    <div>
        <div class="todo-item" :class="{ completed: todo.completed, tracking: todo.isTracking }">
            <div class="todo-content">
                <input class="checkbox" type="checkbox" :checked="todo.completed"
                    @change="$emit('toggle-complete', todo.id)" />
                <span class="todo-text">{{ todo.text }}</span>
            </div>
            <div id="todo-item-el" class="flex gap-2 items-center  ">
                <timer :is-active="todo.isTracking" :start-time="todo.startTime" :total-time="todo.totalTime" />
                <button class="w-10 h-10 hover:cursor-pointer" @click="$emit('toggle-timer', todo.id)"
                    :disabled="todo.completed">
                    <Transition name="fade" mode="out-in">
                        <span class="w-[25px] h-[25px] text-red-500" v-if="todo.isTracking" key="pause">⏹</span>
                        <span class="w-[25px] h-[25px] text-main hover:text-hover" v-else key="play">▶</span>
                    </Transition>
                </button>
                <!-- 汉堡按钮 -->
                <div class="dropdown max-sm:scale-90">
                    <div tabindex="0" role="button" class="btn btn-circle btn-ghost">
                        <svg width="25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 24 24">
                            <path
                                d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"
                                fill="currentColor"></path>
                        </svg>
                    </div>
                    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-25 p-2 shadow-sm">
                        <!-- 删除按钮 -->
                        <li><a @click="$emit('delete-todo', todo.id)"
                                class="my-1 w-full flex justify-center bg-red-500 hover:bg-red-600">
                                <button class="hover:cursor-pointer ">
                                    <svg width="20" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512"
                                        enable-background="new 0 0 512 512" xml:space="preserve">
                                        <g>
                                            <path fill="#fff" d="M128,405.429C128,428.846,147.198,448,170.667,448h170.667C364.802,448,384,428.846,384,405.429V160H128V405.429z M416,96
                                        h-80l-26.785-32H202.786L176,96H96v32h320V96z"></path>
                                        </g>
                                    </svg>
                                </button>
                            </a></li>
                        <li><a @click="showDetails = !showDetails"
                                class="w-full flex justify-center bg-gray-500/30 hover:bg-gray-600/30">
                                <button class="hover:cursor-pointer">
                                    {{ showDetails ? '隐藏详情' : '查看详情' }}
                                </button>
                            </a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="showDetails" class="time-records">
            <h4>时间记录</h4>
            <div v-if="todo.timeRecords.length === 0">
                还没有记录
            </div>
            <ul v-else>
                <li v-for="(record, index) in todo.timeRecords" :key="index">
                    <div>开始: {{ formatDateTime(record.start) }}</div>
                    <div>结束: {{ formatDateTime(record.end) }}</div>
                    <div>持续: {{ formatTime(record.duration) }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import Timer from './Timer.vue'



const props = defineProps({
    todo: {
        type: Object,
        required: true
    }
})

defineEmits(['toggle-complete', 'toggle-timer', 'delete-todo'])

const showDetails = ref(false)

// 格式化时间显示 (毫秒 -> HH:MM:SS)
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

// 格式化日期时间
const formatDateTime = (date) => {
    if (!date) return ''

    const d = new Date(date)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}
</script>

<style scoped>
.todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
}



.todo-item.completed {
    background-color: #e8e8e8;
    opacity: 0.8;
}

.todo-item.tracking {
    border-color: var(--color-primary);
    background-color: #dcddf8;
}

.todo-content {
    display: flex;
    align-items: center;
    flex: 1;
}

.todo-text {
    margin-left: 10px;
    font-size: 16px;
}

.completed .todo-text {
    text-decoration: line-through;
    color: #999;
}


.timer-btn {
    padding: 8px 12px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.timer-btn:disabled {
    background-color: #bbdefb;
    cursor: not-allowed;
}

.timer-running {
    background-color: #f44336;
}

.delete-btn {
    padding: 8px 12px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.details-btn {
    padding: 8px 12px;
    background-color: #9e9e9e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.time-records {
    background-color: #f5f5f5;
    padding: 10px;
    margin-top: -10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 4px 4px;
}

.time-records h4 {
    margin-top: 0;
    margin-bottom: 10px;
}

.time-records ul {
    list-style: none;
    padding: 0;
}

.time-records li {
    border-bottom: 1px solid #eee;
    padding: 8px 0;
}

/* 播放按钮过渡动画 */

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

@media screen and (max-width: 640px) {
    .todo-item {
        padding: 5px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .todo-text {
        font-size: 14px;
    }
}
</style>