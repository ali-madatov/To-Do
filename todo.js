function Todo(name, state) {
  this.name = name;
  this.state = state;
}

var todos = localStorage.getItem('todos') && JSON.parse(localStorage.getItem('todos')).length>0 ? JSON.parse(localStorage.getItem('todos')) : [];
var activeTodos=localStorage.getItem('activeTodos') && JSON.parse(localStorage.getItem('activeTodos')).length>0 ? JSON.parse(localStorage.getItem('activeTodos')) : filterTodosByCategory('active');
var inactiveTodos=localStorage.getItem('inactiveTodos') && JSON.parse(localStorage.getItem('inactiveTodos')).length>0 ? JSON.parse(localStorage.getItem('inactiveTodos')) : filterTodosByCategory('inactive');
var doneTodos=localStorage.getItem('doneTodos') && JSON.parse(localStorage.getItem('doneTodos')).length>0 ? JSON.parse(localStorage.getItem('doneTodos')) : filterTodosByCategory('done');

var states = ["active", "inactive", "done"];
var tabs = ["all"].concat(states);
var currentTab = "all";

var form = document.getElementById("new-todo-form");
var input = document.getElementById("new-todo-title");

form.onsubmit = function(event) {
  event.preventDefault();
  if (input.value && input.value.length) {
    let todo={}

    switch (currentTab) {
      case 'inactive':
        todo = new Todo(input.value, "inactive")
        inactiveTodos.push(todo)
        break;
      case 'done':
        todo = new Todo(input.value, "done")
        doneTodos.push(todo)
        break;
      default:
        todo = new Todo(input.value, "active")
        activeTodos.push(todo)
        break;
    }

    todos.push(todo)

    input.value = "";
    renderTodos();
  }
};

var buttons = [
  { action: "done", icon: "ok" },
  { action: "active", icon: "plus" },
  { action: "inactive", icon: "minus" },
  { action: "up", icon: "chevron-up" },
  { action: "down", icon: "chevron-down" },
  { action: "remove", icon: "trash" },
];


function renderTodos() {
  var todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  localStorage.setItem('todos', [])
  localStorage.setItem('activeTodos', [])
  localStorage.setItem('inactiveTodos', [])
  localStorage.setItem('doneTodos', [])

  let currentTodos = []

  switch (currentTab) {
    case 'all':
      currentTodos = todos
      break;
    case 'active':
      currentTodos = activeTodos
      break;
    case 'inactive':
      currentTodos = inactiveTodos
      break;
    case 'done':
      currentTodos = doneTodos
      break;
    default:
      break;
  }

  for (let [index,todo] of currentTodos.entries()) {
    
      let item = `<div class="row todo-single todo-${todo.state}">
      <div class="col-xs-6 col-sm-9 col-md-10">
        <a class="list-group-item" href="#">${todo.name}</a>
      </div>`

      let btns = ''

      buttons.forEach((btn)=>{
        btns+=`<button data-id="${index}" data-action="${btn.action}" 
          class="btn btn-default btn-xs action-btn" ${btn.action===todo.state?'disabled':''}
          title="${btn.action=='remove'?'Remove':('Mark as '+btn.action)}"
        >
          <i class="glyphicon glyphicon-${btn.icon}"></i>
        </button>`
      })

      item+=`<div class="col-xs-6 col-sm-3 col-md-2 btn-group text-right">${btns}</div></div>`

      todoList.innerHTML+=item
  }


  document.querySelectorAll('.action-btn').forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
      let action = e.currentTarget.dataset.action
      let todoId= e.currentTarget.dataset.id
      let todo = currentTodos.find((el, index)=>{
        return index == todoId
      })

      if(action=='remove'){
        removeTodo(todo)
      }else if(action=='up' || action=='down'){
        moveTodo(Number.parseInt(todoId), action)
      }else{
        setTodo(todo, todo.state, action)
      }

    })
  })


  setTodosCount()
}

renderTodos();


function filterTodosByCategory(state){
  let result = []
  for (let todo of todos) {
    
    if(todo.state==state){
      result.push(todo)
    }
  }
  return result
}


function selectTab(element) {
  var tabName = element.attributes["data-tab-name"].value;
  currentTab = tabName;
  var todoTabs = document.getElementsByClassName("todo-tab");
  for (var i = 0; i < todoTabs.length; i++) {
    todoTabs[i].classList.remove("active");
  }
  element.classList.add("active");
  
  renderTodos();
}


function setTodosCount(){

  let allTodosCount=todos.length
  let activeTodosCount=0
  let inactiveTodosCount=0
  let doneTodosCount=0


  todos.forEach((el)=>{
    if(el.state=='active'){
      activeTodosCount++
    }else if(el.state=='inactive'){
      inactiveTodosCount++
    }else if(el.state='done'){
      doneTodosCount++
    }
  })

  document.getElementById('allTodosCount').innerHTML=allTodosCount
  document.getElementById('activeTodosCount').innerHTML=activeTodosCount
  document.getElementById('inactiveTodosCount').innerHTML=inactiveTodosCount
  document.getElementById('doneTodosCount').innerHTML=doneTodosCount
}


function removeTodo(todo){
 
  if (confirm("Are you sure you want to delete the item titled " + todo.name)){
    todos.splice(todos.indexOf(todo), 1);

    switch (todo.state) {
      case 'active':
        activeTodos.splice(activeTodos.indexOf(todo), 1);
        break;
      case 'inactive':
        inactiveTodos.splice(inactiveTodos.indexOf(todo), 1);
        break;
      case 'done':
        doneTodos.splice(doneTodos.indexOf(todo), 1);
        break;
      default:
        break;
    }

    renderTodos()
  }else{
    return;
  }
}


function setTodo(todo, prevState='active', nextState){

  if(prevState=='active'){

    activeTodos.splice(activeTodos.indexOf(todo), 1);

    todo.state = nextState;
    
    if(nextState=='inactive'){
      inactiveTodos.push(todo)
    }else if(nextState=='done'){
      doneTodos.push(todo)
    }

  }else if(prevState=='inactive'){

    inactiveTodos.splice(inactiveTodos.indexOf(todo), 1);

    todo.state = nextState;
    
    if(nextState=='active'){
      activeTodos.push(todo)
    }else if(nextState=='done'){
      doneTodos.push(todo)
    }
    
  }else if(prevState=='done'){

    doneTodos.splice(doneTodos.indexOf(todo), 1);

    todo.state = nextState;
    
    if(nextState=='inactive'){
      inactiveTodos.push(todo)
    }else if(nextState=='active'){
      activeTodos.push(todo)
    }
    
  }

  let index = todos.indexOf(todo)
  todo.state = nextState;

  todos.splice(index, 1, todo);

  renderTodos()
}

function moveTodo(id, dir='up'){

  let replacedIndex=0; 

  if(dir=='up'){
    if(id-1>=0){
      replacedIndex=id-1
    }else{
      replacedIndex = 0
    }
  }

  if(currentTab==='all'){
    if(dir=='down'){
      if(id+1 <= todos.length-1){
        replacedIndex = id+1
      }else{
        replacedIndex = todos.length-1
      }
    }
    [todos[replacedIndex], todos[id]] = [todos[id], todos[replacedIndex]];
  }else if(currentTab==='active'){
    if(dir=='down'){
      if(id+1 <= activeTodos.length-1){
        replacedIndex = id+1
      }else{
        replacedIndex = activeTodos.length-1
      }
    }
    [activeTodos[replacedIndex], activeTodos[id]] = [activeTodos[id], activeTodos[replacedIndex]];
  }else if(currentTab==='inactive'){
    if(dir=='down'){
      if(id+1 <= inactiveTodos.length-1){
        replacedIndex = id+1
      }else{
        replacedIndex = inactiveTodos.length-1
      }
    }
    [inactiveTodos[replacedIndex], inactiveTodos[id]] = [inactiveTodos[id], inactiveTodos[replacedIndex]];
  }else if(currentTab==='done'){
    if(dir=='down'){
      if(id+1 <= doneTodos.length-1){
        replacedIndex = id+1
      }else{
        replacedIndex = doneTodos.length-1
      }
    }
    [doneTodos[replacedIndex], doneTodos[id]] = [doneTodos[id], doneTodos[replacedIndex]];
  }

  renderTodos()
}