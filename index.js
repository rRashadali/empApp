const express= require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const cors = require('cors');
const { MONGODB } = require('./config');
app.use(cors());
app.use(bodyParser.json());
const port = 3000;

const empRoutes = require('./routes/employees');
app.use('/api/employees', empRoutes);
mongoose.connect(MONGODB,{useNewUrlParser:true,useUnifiedTopology:true,createIndexes:true})
.then(
    ()=>{
        console.log("Connection with MongoDB has been stablised");
      }
)
.catch(()=>console.log("There is a problem with mongoDB connection"));
/* Get Employees list/Add Employee by using mysql*/
const myconnect=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "emp"
  });
  myconnect.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the mysql database.");
  });

  /* Add Employees*/
  app.get('/employees',(req,res)=>{ 
    var resultobj={}; 
    myconnect.query('SELECT * FROM employees',(err,rows,fields)=>{  
    if(!err) 
    {
        resultobj.status=true;
        resultobj.data=rows;
        res.status(200).json(resultobj); 
    }
    else  
        console.log(err);  
      
})  
}); 

app.post('/addemployees',(req,res)=>{ 

    var resultobj={}; 
    var sqlinsert="INSERT INTO `employees` (`empid`, `name`, `email`, `address`) VALUES (NULL, '"+req.body.name+"', '"+req.body.email+"', '"+req.body.address+"')";

    myconnect.query(sqlinsert,(err,rows,fields)=>{  
    if(!err) 
    {
        resultobj.status=true;
        resultobj.message="Employee added successfully.";
        res.status(201).json(resultobj); 
    }
    else  
        console.log(err);  
      
})  
}); 
app.listen(port);



