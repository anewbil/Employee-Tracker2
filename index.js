const {Pool}=require("pg")
const logo =require("asciiart-logo")
const inquirer  = require("inquirer")

const pool=new Pool({
    host:"localhost",
    user:"postgres",
    password:"aero",
    database:"employee_db",
    port:5432
})

console.log("connected to database")

function loadLogo(){
    const text=logo({name:"track the dudes"}).render()
    console.log(text)
askQuestions()
}

function askQuestions(){
    inquirer.prompt([
        {
            type:"list",
            name:"whatToDo",
            message:"what would you like to do",
            choices:[
                "view all departments",
                "view all roles",
                "view all employees",
                "add department",
                "add role",
                "add employee",
                "update employee role",
                "quit"
            
            ]
        }
    ])
    .then ((answers)=>{
        switch(answers.whatToDo){
            case "view all departments":
                viewAllDepartments();
                break;
            case "view all roles":
                viewAllRoles();
                break;
            case "view all employees":
                viewAllEmployees();
                break;
            case "add department":
                addDepartment();
                break;
            case "add role":
                addRole();
                break;
            case "add employee":
                addEmployee();
                break;
            case "update employee role":
                updateEmployeeRole();
                break;
            case "quit":
                quit();
                break;



        }
    })
}

function viewAllDepartments(){
    pool.query("SELECT * FROM department",function(err,res){
        err? console.error(err): console.table(res.rows);askQuestions()
    })
}

function viewAllRoles(){
    pool.query("SELECT * FROM roles",function(err,res){
        err? console.error(err): console.table(res.rows);askQuestions()
    })
}

function viewAllEmployees(){
    pool.query("SELECT * FROM employee",function(err,res){
        err? console.error(err): console.table(res.rows);askQuestions()
    })
}

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name:"department",
            message:" What department are you adding?"
        }
    ])
    .then ((response)=>{
        let newDepartment= response.department;

        pool.query("INSERT INTO department VALUES ($1)",[newDepartment],function(err,res){
            err? console.error(err): viewAllDepartments();
        })
    })
}

function addRole(){

}

function addEmployee(){

}

function updateEmployeeRole(){

}

function quit(){
    console.log("goodbye")
    process.exit()
}



loadLogo()