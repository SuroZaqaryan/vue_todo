<template>
  <div class="todo">
    <div class="todo__content">
      <div class="title">
        <input
            v-if="todo.isEditing"
            type="text"
            v-model="todo.title"
            @focusout="todo.isEditing = false, editTodo(todo)"
            ref="editInputRef"
        >
        <p v-else :class="{ completed: todo.completed }" :title="todo.title">
          {{ todo.title }}
        </p>
      </div>

      <img
          @mouseleave="todo.isContextVisible = false"
          @mouseover="todo.isContextVisible = true"
          src="@/assets/icons/dots.svg"
          alt="dots"
      >

      <div
          v-show="todo.isContextVisible"
          @mouseleave="todo.isContextVisible = false"
          @mouseover="todo.isContextVisible = true"
          class="todo__editing"
      >
        <ul>
          <li @click="todo.isEditing = true, setFocus()">Редактировать</li>
          <li @click="deleteTodo(todo.id, todo.guid)">Удалить</li>
        </ul>
      </div>
    </div>

    <div class="todo__complete">
      <button @click="moveToReady(todo)">
        {{ todo.completed ? 'Вернуть назад' : 'Заврешить' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, nextTick} from "vue";

const { todo } = defineProps(['todo'])
import {useTodoListStore} from "@/store/useTodoListStore";

const editInputRef = ref(null);
const store = useTodoListStore();

const {moveToReady, deleteTodo, editTodo} = store;

function setFocus() {
  nextTick(() => editInputRef.value.focus());
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/TodoList.scss";
</style>
