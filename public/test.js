function htmlTemplate(item){
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
    <button data-id =" ${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button  data-id ="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
  </li>`
}
// initials load Page
let ourHTML = items.map(function(item){
  return htmlTemplate(item)
}).join('')
document.getElementById('create-list').insertAdjacentHTML("beforeend", ourHTML)

// Create items
let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener('submit', function(e){
  e.preventDefault();
  axios.post('/item-create', {text:createField.value}).then(function(response){
     document.getElementById("create-list").insertAdjacentHTML('beforeend', htmlTemplate(response.data))
      createField.value = "";
      createField.focus();
  }).catch(function(err){
    console.log(err)
  })
})



document.addEventListener('click', function(e){
    // delete item
    if(e.target.classList.contains("delete-me")){
       if(confirm("Do you really want to delete item permently?")){
        axios.post('/delete-item',{id:e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.remove()
        }).catch(function(error){
                console.log(error)
        })  

       }
    }

    // update item
    if(e.target.classList.contains('edit-me')){
      let userIntput = prompt("Enter your desire list button", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if(userIntput){
            axios.post('/update-item',{text:userIntput, id:e.target.getAttribute("data-id")}).then(function(){
       
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userIntput
               }).catch(function(err){                  
                 console.log(err)
               })
             }
        }
})