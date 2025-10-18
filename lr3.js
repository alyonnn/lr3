const API_BASE = 'https://jsonplaceholder.typicode.com';

const retrieveData = async (resource) => {
  try {
    const response = await fetch(`${API_BASE}/${resource}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
};


function fetchAndSortTitlesCallback(onSuccess) {
  retrieveData('posts')
    .then(list => {
      const sortedList = list.sort((a, b) => b.title.length - a.title.length);
      onSuccess(sortedList);
    })
    .catch(error => console.error('Error in fetchAndSortTitlesCallback:', error));
}

function fetchAndSortNamesCallback(completionHandler) {
  retrieveData('comments')
    .then(data => {
      const organizedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
      completionHandler(organizedData);
    })
    .catch(error => console.error('Error in fetchAndSortNamesCallback:', error));
}


function getCleanedUsersPromise() {
  return retrieveData('users')
    .then(userData => userData.map(user => {
      const { id: userId, name: fullName, username: alias, email: contactEmail, phone: contactPhone } = user;
      return { userId, fullName, alias, contactEmail, contactPhone };
    }))
    .catch(error => console.error('Error in getCleanedUsersPromise:', error));
}

function getPendingTasksPromise() {
  return retrieveData('todos')
    .then(tasks => tasks.filter(item => item.completed !== true))
    .catch(error => console.error('Error in getPendingTasksPromise:', error));
}


async function getSortedTitlesAsync() {
  try {
    const postData = await retrieveData('posts');
    const result = postData.slice().sort((a, b) => b.title.length - a.title.length);
    return result;
  } catch (error) {
    console.error('Could not get sorted posts.', error);
    return []; 
  }
}

async function getSortedNamesAsync() {
  try {
    const commentData = await retrieveData('comments');
    return commentData.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Could not get sorted comments.', error);
    return [];
  }
}

async function getStrippedUsersAsync() {
  try {
    const userRecords = await retrieveData('users');
    return userRecords.map(({ id, name, username, email, phone }) => ({
      ID: id,
      Name: name,
      Alias: username,
      Email: email,
      Phone: phone,
    }));
  } catch (error) {
    console.error('Could not get stripped users.', error);
    return [];
  }
}

async function getUnfinishedTodosAsync() {
  try {
    const todoList = await retrieveData('todos');
    return todoList.filter(task => task.completed === false);
  } catch (error) {
    console.error('Could not get unfinished todos.', error);
    return [];
  }
}


console.log('--- CALLBACK EXAMPLES ---');
fetchAndSortTitlesCallback(data => console.log('Callback Posts (by title length):', data.slice(0, 3)));
fetchAndSortNamesCallback(data => console.log('Callback Comments (by name):', data.slice(0, 3)));

console.log('\n--- PROMISE EXAMPLES ---');
getCleanedUsersPromise().then(data => console.log('Promise Users (cleaned):', data.slice(0, 3)));
getPendingTasksPromise().then(data => console.log('Promise Todos (pending):', data.slice(0, 3)));

console.log('\n--- ASYNC/AWAIT EXAMPLES ---');
(async () => {
  console.log('Async Posts:', (await getSortedTitlesAsync()).slice(0, 3));
  console.log('Async Comments:', (await getSortedNamesAsync()).slice(0, 3));
  console.log('Async Users:', (await getStrippedUsersAsync()).slice(0, 3));
  console.log('Async Todos:', (await getUnfinishedTodosAsync()).slice(0, 3));
})();
