import { Context } from 'https://deno.land/x/abc@v1.3.3/mod.ts';

import { Todo } from '../models/todos.ts';

let todos: Todo[] = [
  { item: 'Do refactoring' },
  { item: 'Do chores' },
  { item: 'Do tests' },
];

export const getAllTodos = async (ctx: Context) => {
  return ctx.json(todos, 200);
};

export const getTodo = async (ctx: Context) => {
  const { id } = ctx.params;
  const todo = todos.find((todo: Todo) => todo.id === id);

  if (todo) return ctx.json(todo, 200);

  return ctx.string('Todo not found!', 404);
};

export const createTodo = async (ctx: Context) => {
  const { item } = (await ctx.body) as Todo;

  const newTodo = { item };
  todos.push(newTodo);

  return ctx.json(newTodo, 201);
};
