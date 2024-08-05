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

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What department are you adding?",
        },
    ]).then((response) => {
        const newDepartmentName = response.department;

        pool.query("INSERT INTO department (department_name) VALUES ($1)", [newDepartmentName], (err, res) => {
            if (err) {
                console.error("Error inserting department:", err);
            } else {
                console.log("Department added successfully.");
                viewAllDepartments(); 
            }
        });
    }).catch((err) => console.error(err));
}

function addRole(){
    pool.query("SELECT * FROM department", function(err,res){
        if (err) {
            console.log(err)
            askQuestions()
        }
        let departmentChoices=res.rows.map((dept)=>({
            value:dept.id,
            name:dept.department_name,
        }))
        inquirer.prompt([
            {
                type:"list",
                name:"departmentName",
                message:"what department does this role belong to?",
                choices:departmentChoices
            },
            {
                type:"input",
                name:"roleTitle",
                message:"what role are you adding?"
            },
            {
                type:"input",
                name:"salary",
                message:"what's the salary for this role"
            },

        ]) .then((response)=>{
            let departmentChoice=response.departmentName;
            let roleTitle=response.roleTitle;
            let salary= response.salary;
            pool.query("INSERT INTO roles (title,salary,department_id) values ($1,$2,$3)",[roleTitle, salary, departmentChoice],function(err,res){
                if(err){
                    console.log("it broke",err)
                } else{
                    console.log("it not broke")
                    viewAllRoles()
                }
            })
        })

    })
}

function addEmployee(){
pool.query("SELECT * FROM roles ",function(err,res){
    if(err){
        console.log(err)
        askQuestions()
    } 
    let roleList=res.rows.map((role)=>({
        value:role.id,
        name:role.title 
    }))
pool.query("SELECT * FROM employee", function(err,res){
    if (err){
        console.log(err)
        askQuestions()
    }
    let managerList=res.rows.map((manager)=>({
        value:manager.id,
        name:`${manager.first_name} ${manager.last_name}`
    }))
    managerList.push({value:null,name:"no manager"})

    inquirer.prompt([
        {
            type:"input",
            name:"firstName",
            message:"enter first name",
        },
        {
            type:"input",
            name:"lastName",
            message:"enter last name"
        },
        {
            type:"list",
            name:"role",
            message:"what role does this employee belong to",
            choices:roleList
        },
        {
            type:"list",
            name:"manager",
            message:"select the employees manager or select no manager",
            choices:managerList
        }
    ])
    .then((response)=>{
        let empFirstName=response.firstName;
        let empLastName=response.lastName;
        let roleChoice=response.role;
        let managerChoice=response.manager

        pool.query("INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ($1,$2,$3,$4)",[empFirstName,empLastName,roleChoice,managerChoice],
    function(err,res){
        if(err){
            console.log("it broke",err)
            askQuestions()
        } else{
            console.log("it not broke")
            viewAllEmployees()
        }
    })
    })
})
})
}


function updateEmployeeRole(){
pool.query("SELECT * FROM roles ",function(err,res){
    if(err){
        console.log(err)
        askQuestions()
    }
    let rolesToChange=res.rows.map((role)=>({
        value:role.id,
        name:role.title,
    }))
pool.query("SELECT * FROM employee", function(err,res){
    if(err){
        console.log(err)
        askQuestions()
    }
    let employeeToChange=res.rows.map((employee)=>({
        value:employee.id,
        name:`${employee.first_name} ${employee.last_name}`
    }))
    inquirer.prompt([
        {
            type:"list",
            name:"employeeChoice",
            message:"select an employee to change roles",
            choices:employeeToChange
        },
    {
        type:"list",
        name:"roleChoice",
        message:"what role are you switching to",
        choices:rolesToChange
    }
    ]). then((response)=>{
        let employee=response.employeeChoice;
        let role=response.roleChoice;

        pool.query("UPDATE employee SET roles_id =$1 WHERE id=$2",[role,employee],function(err,res){
            if(err){
                console.log(err)
                askQuestions()
            } else{
                viewAllEmployees()
            }
        })
    })
})
    
})
}

function quit(){
    console.log("goodbye")
    process.exit()
}



loadLogo()