<template>
  <main>
    <todo-form />
    <todo-list />
  </main>
</template>

<script>
import { defineComponent } from "vue";
import TodoForm from "./TodoForm.vue";
import TodoList from "./TodoList.vue";

export default defineComponent({
  components: { TodoForm, TodoList },
  setup() {
    return {};
  },
});
</script>