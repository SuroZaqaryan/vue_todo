import {defineStore} from "pinia";
import {v4 as uuidv4} from 'uuid';

const getLocalStorageTodoList = () => {
  return JSON.parse(localStorage.getItem('todoList')) || [];
};

const setLocalStorageTodoList = (todoList) => {
  localStorage.setItem('todoList', JSON.stringify(todoList));
};

export const useTodoListStore = defineStore("todoList", {
  state: () => ({
    todoList: getLocalStorageTodoList(),
    showAlert: false,
  }),

  actions: {
    async getTodos() {
      try {
        let todoList = getLocalStorageTodoList();

        if (todoList.length) {
          return todoList;
        }

        const response = await fetch(`${process.env.BASE_URL}/todos`);

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        let data = (await response.json()).map(todo => {
          todo.guid = uuidv4();
          return todo;
        });

        const slicedData = data.slice(0, 15);

        setLocalStorageTodoList(slicedData);

        return slicedData;
      } catch (err) {
        console.error('Error getting todos:', err);
        throw err;
      }
    },

    async addTodo(item) {
      const todoList = getLocalStorageTodoList();
      let requestBody = {userId: 1, title: item, body: '', completed: false};

      try {
        const response = await fetch(`${process.env.BASE_URL}/todos`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        data.guid = uuidv4();

        todoList.push(data);
        setLocalStorageTodoList(todoList);

        this.todoList.push(data);

        return data;
      } catch (error) {
        console.error('Error:', error);
      }
      // const newTodo = { id: uuidv4(), title: item, completed: false };
      // const todoList = getLocalStorageTodoList();
      //
      // todoList.push(newTodo);
      // setLocalStorageTodoList(todoList);
      // this.todoList.push(newTodo);
    },

    async deleteTodo(id, guid) {
      try {
        const response = await fetch(`${process.env.BASE_URL}/todos/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete todo');
        }

        let todoList = getLocalStorageTodoList();
        todoList = todoList.filter(todo => todo.guid !== guid);

        setLocalStorageTodoList(todoList);
        this.todoList = this.todoList.filter(todo => todo.guid !== guid);

      } catch (error) {
        console.error(`Error deleting todo with ID ${guid}: ${error.message}`);
        throw error;
      }
    },

    async editTodo(updatedTodo) {
      try {
        const response = await fetch(`${process.env.BASE_URL}/todos/${updatedTodo.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updatedTodo),
        });

        if (!response.ok) {
          throw new Error('Failed to update todo');
        }

        const data = await response.json();
        let todoList = getLocalStorageTodoList();

        todoList = todoList.map(todo => (todo.guid === data.guid ? data : todo));

        setLocalStorageTodoList(todoList);
        this.todoList = todoList;
      } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
      } finally {
        const todoList = getLocalStorageTodoList();

        todoList.forEach((todo, index) => {
          if (todo.id === updatedTodo.id) todoList[index] = updatedTodo;
        });

        setLocalStorageTodoList(todoList);
      }
    },

    moveToReady(todo) {
      const todoList = getLocalStorageTodoList();
      const updatedTodoList = todoList.map(t => (t.guid === todo.guid ? {...t, completed: !t.completed} : t));

      setLocalStorageTodoList(updatedTodoList);
      this.todoList = updatedTodoList;
    },

    inputAlert() {
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 1000);
    },
  },

  getters: {
    pendingTodos: (state) => state.todoList.filter(todo => !todo.completed),
    completedTodos: (state) => state.todoList.filter(todo => todo.completed),
  },
});
