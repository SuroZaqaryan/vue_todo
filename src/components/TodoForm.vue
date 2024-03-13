<template>
  <form @submit.prevent="addItemAndClear(todo)" class="todo-form">
    <div class="todo-form__input">
      <input v-model="todo" @keydown.enter.prevent="addItemAndClear(todo)" type="text" placeholder="Добавить задачу..." />
      <button>
        Добавить
      </button>
    </div>

    <div v-show="store.showAlert" class="todo-form__alert">
      <p>Пожалуйста напишите что-нибудь...</p>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useTodoListStore } from "../store/useTodoListStore";

const todo = ref("");
const store = useTodoListStore();

function addItemAndClear(item) {
  if (item.length === 0) {
    store.inputAlert();
    return;
  }

  store.addTodo(item);
  todo.value = "";
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/TodoForm.scss";
</style>