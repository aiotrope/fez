// accepted solutions for the exercise 2: Using Databases
import { load } from 'https://deno.land/std/dotenv/mod.ts';
import postgres from 'https://deno.land/x/postgresjs@v3.3.3/mod.js';
const env = await load();

// const sql = postgres({});

const portConfig = { port: 7777 };

const sql = postgres({
  host: env['POSTGRES_HOST'],
  username: env['POSTGRES_USER'],
  password: env['POSTGRES_PASSWORD'],
  database: env['POSTGRES_DB'],
  port: env['POSTGRES_PORT'],
  max: 2,
});

const getAllTodos = async () => {
  const todos = await sql`select * from todos`;

  return Response.json(todos);
};

const getTodo = async (_request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;

  try {
    const todos = await sql`select * from todos where id = ${id}`;
    return Response.json(todos[0]);
  } catch (err) {
    return new Response(err.message, { status: 404 });
  }
};

const createTodo = async (request) => {
  try {
    const body = await request.text();
    const json = await JSON.parse(body);

    if (json?.item?.length > 0 || json?.item !== '') {
      await sql`insert into todos (item) values (${json.item})`;
      return Response.json(json, { status: 200 });
    } else {
      return new Response('Cannot create todo!', { status: 400 });
    }
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
};

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: getAllTodos,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: getTodo,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: createTodo,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response('Not found', { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  return await mapping.fn(request, mappingResult);
};

const handleHttpConnection = async (conn) => {
  for await (const requestEvent of Deno.serveHttp(conn)) {
    requestEvent.respondWith(await handleRequest(requestEvent.request));
  }
};

for await (const conn of Deno.listen(portConfig)) {
  handleHttpConnection(conn);
}
