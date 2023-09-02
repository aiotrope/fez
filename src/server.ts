import {
  serve,
  ServerRequest,
} from 'https://deno.land/std@0.53.0/http/server.ts';
import { Status } from 'https://deno.land/std@0.53.0/http/http_status.ts';
import { readAll } from 'https://deno.land/std@0.201.0/streams/read_all.ts';

const s = serve({ port: 7777 });

interface Todo {
  item: string;
}

const todos: Todo[] = [
  { item: 'Do refactoring' },
  { item: 'Do chores' },
  { item: 'Do tests' },
];

const handleGetTodosReq = async (req: ServerRequest): Promise<void> => {
  return await req.respond({ status: Status.OK, body: JSON.stringify(todos) });
};

const handlePostTodosReq = async (req: ServerRequest): Promise<void> => {
  const decoder = new TextDecoder();
  const buf = await readAll(req.body);
  const json = JSON.parse(decoder.decode(buf));

  if (json && json.item.length > 0) {
    todos.push(json);
    return await req.respond({
      status: Status.OK,
      body: JSON.stringify(json),
    });
  } else {
    return await req.respond({
      status: Status.BadRequest,
    });
  }
};

const handleNotFound = async (req: ServerRequest): Promise<void> => {
  return await req.respond({
    status: Status.NotFound,
    body: JSON.stringify({ message: 'Request Not Found' }),
  });
};

for await (const req: ServerRequest of s) {
  if (req.method === 'GET' && req.url === '/todos') {
    handleGetTodosReq(req);
  } else if (req.method === 'POST' && req.url === '/todos') {
    handlePostTodosReq(req);
  } else {
    handleNotFound(req);
  }
}
