<template>
  <div class="wrapper">
    <div class="wrapper__container">
      <h3>Задачи в очереди ⏱️</h3>
      <div class="list">
        <todoCard v-for="todo in store.pendingTodos" :todo="todo" :key="todo.id"/>
      </div>
    </div>


    <div class="wrapper__container">
      <h3>Выполненные задачи ✅</h3>
      <div class="list">
        <todoCard v-for="todo in store.completedTodos" :todo="todo" :key="todo.id"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useTodoListStore} from "@/store/useTodoListStore";
import todoCard from "@/components/TodoCard.vue"

const store = useTodoListStore();

onMounted(async () => {
  store.todoList = await store.getTodos()
})

const {todoList} = storeToRefs(store);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/TodoList.scss";
</style>
