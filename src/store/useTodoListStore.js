import {defineStore} from "pinia";

export const useTodoListStore = defineStore("todoList", {
  state: () => ({
    todoList: JSON.parse(localStorage.getItem('todoList')) || [],
    id: 0,
    showAlert: false,
  }),

  actions: {
    async getTodos() {
      try {
        let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

        if (todoList.length) {
          return todoList;
        }

        const response = await fetch(`${process.env.BASE_URL}/todos`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        let data = await response.json();

        const slicedData = data.slice(0, 15);

        localStorage.setItem('todoList', JSON.stringify(slicedData));

        return slicedData;
      } catch (err) {
        console.error(err)
      }
    },

    async addTodo(item) {
      let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
      let requestBody = {userId: 1, title: item, body: '', completed: false};

      try {
        const response = await fetch(`${process.env.BASE_URL}/todos`, {
          method: 'POST',
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        todoList.push(data);
        localStorage.setItem('todoList', JSON.stringify(todoList));

        this.todoList.push(data);
        return data;
      } catch (error) {
        console.error('Error:', error);
      }
    },

    async deleteTodo(itemID) {
      try {
        const response = await fetch(`${process.env.BASE_URL}/todos/${itemID}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
          todoList = todoList.filter((object) => object.id !== itemID);

          this.todoList = this.todoList.filter((object) => object.id !== itemID);

          localStorage.setItem('todoList', JSON.stringify(todoList));
        }
      } catch (error) {
        console.error(`Error deleting data with ID ${itemID}: ${error.message}`);
      }
    },

    async editTodo(item) {
      const {completed, id, title, userId} = item;

      try {
        const response = await fetch(`${process.env.BASE_URL}/todos/${item.id}`
          , {
          method: 'PUT',
          body: JSON.stringify({
            completed,
            id,
            title,
            userId
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update data');
        }

        let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

        todoList.forEach((todo, index) => {
          if (todo.id === item.id) todoList[index] = item;
        });

        localStorage.setItem('todoList', JSON.stringify(todoList));
      } catch (error) {
        console.error('Error updating data:', error);
        throw error;
      }
    },

    moveToReady(item) {
      let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
      const todo = this.todoList.find(obj => obj.id === item.id);

      if (todo) {
        todo.completed = !todo.completed;
      }

      todoList.forEach((todo, index) => {
        if (todo.id === item.id) todoList[index] = item;
      });

      localStorage.setItem('todoList', JSON.stringify(todoList));
    },

    inputAlert() {
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 1000);
    },
  },

  getters: {
    pendingTodos: (state) => {
      return state.todoList.filter(todo => !todo.completed);
    },

    completedTodos: (state) => {
      return state.todoList.filter(todo => todo.completed);
    },
  },
});
