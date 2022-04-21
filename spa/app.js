// Basic application data
const table = document.querySelector('.table')
const form = document.querySelector('.form')

// Links variables
let nameInput;
let phoneInput;

// State
let data = [
    {id: 11312, name: 'Максим', phone: '89608748384'},
    {id: 55342, name: 'Никита', phone: '89600848614'},
    {id: 36456, name: 'Артем', phone: '89603448234'},
    {id: 48678, name: 'Алина', phone: '89606748944'},
    {id: 52453, name: 'Екатерина', phone: '89605612384'},
]

let edit = false
let newName = undefined
let newPhone = undefined

// Functions
const deleteFunc = (id) => {
    data = data.filter(e => e.id !== id )
    DELETE_REQUEST(id)
    Render(data)
}

const editFunc = (e) => {
    const id = +e.path[1].dataset.id
    const list = [...document.querySelectorAll(`[data-id='${id}'] > .td`)]

    if (!edit) {
        edit = true
        list.forEach((e,ind) => ind !== 2 ?  e.innerHTML = `<input value="${e.textContent}" type="text" class="table_edit_input">` : e.textContent = 'Сохранить')
    } else{
        edit = false
        const newList = list.map((e,ind) => ind !== 2 ? e.textContent = e.children[0].value : e.textContent = 'Редактировать')
        
        data = data.map(elem => {
            if(elem.id === id){
                if(validation(newList[0],newList[1])){
                    const newItem = {id, name: newList[0] , phone: newList[1]}
                    DELETE_REQUEST(id)
                    ADD_REQUEST(newItem)
                    return newItem
                } else{
                 return elem   
                }
            } else{
                return elem
            }
        })
        setTimeout(() => Render(data), 2000)
    }
}

const setNewName = e => newName = e.target.value

const setNewPhone = e => newPhone = e.target.value

const addFunc = (e) => {
    e.preventDefault()
    if(validation(newName,newPhone)){
        if (form.contains(document.querySelector('.add_person_error_span'))){
            form.removeChild(document.querySelector('.add_person_error_span'))
        }
        const newItem = {id: IDGenerate(), name: newName, phone: newPhone}
        data.push(newItem)
        ADD_REQUEST(newItem)
        Render(data)
    }
}

const validation = (Name, Phone) => {
    const phoneValidation = (phone) => {
        const phoneRegExp = /^(\+7|7|8){1}(-\d{3}-\d{3}-\d{2}-\d{2}|\d{3}\d{3}\d{2}\d{2}|\d{3}-\d{3}-\d{2}-\d{2})/
        return phoneRegExp.test(phone)
    }

    const validationError = (link,text) => {
        const errorMsg = `Неверный формат у ${text}`
        
        const span = document.createElement('span')
        span.textContent = errorMsg
        span.setAttribute('class','add_person_error_span')
        const spanLink = document.querySelector('.add_person_error_span')

        const check = form.contains(spanLink)
        if(!check) { form.prepend(span) }
        if(check){ spanLink.textContent = errorMsg }

        
        setTimeout(() => {
            link.setAttribute('placeholder', `Введите ${text}`)
            link.classList.remove('error')
        },2000)

        if(Name === newName || Phone === newPhone){
            link.classList.add('error')
        }
    }

    if(!!Name){
        if(phoneValidation(Phone)){
            return true
        } else{
            validationError(phoneInput,'номер телефона')
            return false
        }
    } else{
        validationError(nameInput,'имя')
        return false
    }
}

const IDGenerate = e =>  Math.round(Math.random(0,1) * 10000) * Math.round(Math.random(0,1) * 10)

const Render = data => {
    table.innerHTML = Table(data)
    form.innerHTML = Form()

    // Event listeners
        // Table
        document.querySelectorAll('.table_edit_btn_placeholder').forEach(e => e.addEventListener('click', event => editFunc(event)))
        // Form listeners
        nameInput = document.querySelector('.add_person_name_input')
        phoneInput = document.querySelector('.add_person_phone_input')

        document.querySelector('.add_person_save_btn').addEventListener('click', e => addFunc(e))
        nameInput.addEventListener('change', e => setNewName(e))
        phoneInput.addEventListener('change', e => setNewPhone(e))
}

// Components
const TableItem = (data,ind) => {
    const {name,phone,id} = data
    return `
        <tr data-id=${id}>
            <td class="table_list_index_placeholder">${++ind}</td>
            <td class="table_name_placeholder td">${name}</td>
            <td class="table_phone_number_placeholder td">${phone}</td>
            <td class="table_edit_btn_placeholder td">Редактировать</td>
            <td class="table_delete_btn_placeholder" onclick="deleteFunc(${id})">Стереть</td>
        </tr>
    `
}

const Table = (data) => {
    return `
        <table>
            <tr>
                <th>№</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Редактировать</th>
                <th>Стереть</th>
            </tr>
            ${data.map((personData,ind) => TableItem(personData,ind)).join('')}
        </table>
    `
}

const Form = () => {
    return `
    <form class="add_person_form"> 
        <input type="text" placeholder="Введите имя" value="" class="add_person_name_input" >
        <input type="tel" placeholder="Введите номер телефона" value="" class="add_person_phone_input">
        <button class="add_person_save_btn" >Добавить</button>
    </form>
`
}

// Result
Render(data)

// Server requests
    const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts/'

    const requestFunc = (url,options = {}) => {
        fetch(url,options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.log(err))
    }

    // GET
        const GET_DATA_REQUEST = () => {
            requestFunc(SERVER_URL,POST_OPTIONS = {})
        }

    // ADD
        const ADD_REQUEST = (payload) => {
            const POST_OPTIONS = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(payload)
            }   
            requestFunc(SERVER_URL,POST_OPTIONS)
        }

    // DELETE
        const DELETE_REQUEST = (id) => {
            const POST_OPTIONS = {
                method: 'DELETE',
            }   
            requestFunc(SERVER_URL + id,POST_OPTIONS)
        }


