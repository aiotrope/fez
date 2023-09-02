// accepted solutions for the exercise

const portConfig = { port: 7777 };

const todos = [
  { item: 'Do refactoring' },
  { item: 'Do chores' },
  { item: 'Do tests' },
];

const getAllTodos = () => {
  return Response.json(todos);
};

const createTodo = async (request) => {
  const body = await request.text();

  try {
    const json = await JSON.parse(body);
    todos.push(json);
    return Response.json(json, { status: 200 });
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
