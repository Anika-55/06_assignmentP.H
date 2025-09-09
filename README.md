# Green Earth

# 🌱 Green Earth

## 📘 JavaScript Basics (Quick Notes)

### 1. var, let, const
- **var** → function-scoped, hoisted, redeclaration allowed.  
- **let** → block-scoped, no redeclare, reassignment allowed.  
- **const** → block-scoped, no redeclare, **no reassignment**.  

### 2. map(), forEach(), filter()
- **map()** → returns a **new array** (transforms values).  
- **forEach()** → loops for side effects (**no return**).  
- **filter()** → returns a **new array** with items that pass a condition. 

## 3. Arrow Functions (ES6)
- Shorter syntax:  
  ```js
  const add = (a, b) => a + b;
Do not have their own this (use lexical this).

4. Destructuring Assignment (ES6)
Extract values from arrays/objects:

js
Copy code
const [a, b] = [1, 2];
const { name, age } = person;
5. Template Literals (ES6)
Use backticks ` with ${} for interpolation.

Support multiline strings:

js
Copy code
const name = "Anika";
const age = 20;
console.log(`Hello ${name}, age ${age}`);
pgsql
Copy code
. Template Literals (ES6)

Use backticks ` with ${} for interpolation.

Support multiline strings:

const name = "Anika";
const age = 20;
console.log(`Hello ${name}, age ${age}`);

