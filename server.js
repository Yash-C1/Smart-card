var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
const app = express();
var ejs = require("ejs");
const port = process.env.PORT || 3000;



var router = express.Router()

//var ObjectId = require('mongodb').ObjectId;

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/studentsdata',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
});
var db = mongoose.connection;

db.on('error',()=>console.log("Error in connecting db."));
db.once('open',()=>console.log("Connected to db."));

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended:true
}));

app.post("/signup", (req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var division = req.body.division;
    var reg_id = req.body.reg_id;
    var psw = req.body.psw;
    var psw_repeat = req.body.psw_repeat;
    var balance = 5000;
    var SS = 0;
    var PCS = 0;
    var CS = 0;
    var OOP = 0;
    var ESD = 0;
    var history = "";
    

    var data = {
        "name" : name,
        "email" : email,
        "phno" : phno,
        "division" : division,
        "reg_id" : reg_id,
        "psw" : psw,
        "psw_repeat" : psw_repeat,
        "balance" : balance,
        "SS" : SS,
        "PCS" : PCS,
        "CS" : CS,
        "OOP" : OOP,
        "ESD" : ESD,
        "history" : history,
        

    }



    db.collection('users').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted succesfully");
    });

    //
    // const dbdata = db.collection('users').find(email);
    // console.log(dbdata);
    //
    //res.render('/signin');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'testingproject645@gmail.com',
          pass: 'Test@smartcard'
        }
      });
      
      var mailOptions = {
        from: 'testingproject645@gmail.com',
        to: email,
        subject: 'Registration successful.',
        text: 'Your unique ID is: ' + data._id + '   .This ID can be used if you forget your password.Do not share this ID with anyone else.'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          //console.log(data._id);
        }});
    res.sendFile(__dirname + "/public/" + "signin.html" );
    
})

// const dbdata = db.collection('users').find()
// console.log(dbdata);




//-------------------------------------------------------------------------------------
app.post("/total_attendance", async (req,res) => {
    try {
        const pin = req.body.pin;
        const division = req.body.division;
        const subjects = req.body.subjects;
        const lec_no = req.body.lec_no;
        const User_SS_total = 0;

        const attendance_data = await db.collection('total_lectures').findOne({division:division});

        var attendance = attendance_model.find({division:division});

        
                res.render("portal",{
                    records : data,
                });
        
        if(subjects == "SS"){
            const updated_attendance_SS = attendance_data.SS_total += 1;
            db.collection('total_lectures').updateOne({division},{
                $set : {
                    SS_total : updated_attendance_SS
                }
            })
        }
        if(subjects == "PCS"){
            const updated_attendance_PCS = attendance_data.PCS_total += 1;
            db.collection('total_lectures').updateOne({division},{
                $set : {
                    PCS_total : updated_attendance_PCS
                }
            })
        }
        if(subjects == "CS"){
            const updated_attendance_CS = attendance_data.CS_total += 1;
            db.collection('total_lectures').updateOne({division},{
                $set : {
                    CS_total : updated_attendance_CS
                }
            })
        }
        if(subjects == "ESD"){
            const updated_attendance_ESD = attendance_data.ESD_total += 1;
            db.collection('total_lectures').updateOne({division},{
                $set : {
                    ESD_total : updated_attendance_ESD
                }
            })
        }
        if(subjects == "OOP"){
            const updated_attendance_OOP = attendance_data.OOP_total += 1;
            db.collection('total_lectures').updateOne({division},{
                $set : {
                    OOP_total : updated_attendance_OOP
                }
            })
        }
    }catch(error){
        throw error;
    }
})










app.post("/pictPortal_login", async (req,res) => {
    try{
        const email = req.body.email;
        const psw = req.body.psw;
        

        const user_email = await db.collection('users').findOne({email:email});
        

        


//------------------------------------------------------------------------------------
        // if(user_email.position == "t")
        // {
        //     //const teacher_email = await db.collection('teacher').findOne({email:email});
 
        //     if(user_email.psw === psw){
        //        res.sendFile(__dirname + "/public/" + "teacher.html" );
        //     }

        // }

        
        

//------------------------------------------------------------------------------------








        //const user_name = await db.collection('users').findOne({email:email},{name:1});
        const name = user_email.name;
        const phno = user_email.phno;
        const division = user_email.division;
        const reg_id = user_email.reg_id;
        const balance = user_email.balance;
        const SS = user_email.SS;
        const PCS = user_email.PCS;
        const CS = user_email.CS;
        const OOP = user_email.OOP;
        const ESD = user_email.ESD;
        const history = user_email.history;
        
       
       // console.log(SS_total);

        
        if(user_email.psw === psw){
            res.render("portal",{
                userPsw : psw,
                userEmail : email,
                userName : name,
                userPhno : phno,
                userDivision : division,
                userReg_id : reg_id,
                user_balance : balance,
                user_SS : SS,
                user_PCS : PCS,
                user_CS : CS,
                user_OOP : OOP,
                user_ESD : ESD,
                user_history : history,

            });
            //res.sendFile(__dirname + "/public/" + "pictPortal.html" );
        
        }else{
            res.send("Invalid password.");
        }

        // res.send(user_email.psw);
        // console.log(user_email)
        // console.log(email + psw);
       
    }catch(error){
        //throw error;
        res.send("Invalid email.");
    }
    //res.sendFile(__dirname + "/public/" + "pictPortal.html" );
})

app.post("/reset_page", async (req,res) => {
    try {
        const email = req.body.email;
        const id = req.body.ID;
        const user_data = await db.collection('users').findOne({email:email});
        // console.log(user_data._id);
        // console.log(id);
        if(user_data._id == id){
            res.sendFile(__dirname + "/public/" + "reset.html" );
        }else{
            res.send("Invalid ID.");
        }
    }catch(error){
        throw error;
    }
})

app.post("/new_password", async(req,res) => {
    try {
        const name = req.body.name;
        const new_pass = req.body.new_pass;
        const new_pass_rep = req.body.new_pass_rep;
        //const user_data = await db.collection('users').findOne({name:name});

        if(new_pass == new_pass_rep){
            // user_data.psw = new_pass;
            // user_data.psw_repeat = new_pass_rep;
            db.collection('users').updateOne({name},{
                $set : {
                    psw : new_pass,
                    psw_repeat : new_pass_rep
                }
            })
            res.sendFile(__dirname + "/public/" + "signin.html" );
        }else{
            res.send("Password and repeat passwords do not match! Try again.");
        }

    } catch (error) {
        //res.send("No user with this name exists.")
        throw error;
    }
})

app.post("/message", async(req,res) => {
    try {
        const message = req.body.message;
        //console.log(message);
        var data = {
            "message" : message,
        }
        db.collection('users_messages').insertOne(data,(err,collection) => {
            if(err){
                throw err;
            }
            console.log("Message saved succesfully");
        });
        //res.render("portal");
        //res.send("Message recieved.You can go back on the portal now!");
    } catch (error) {
        throw error;
    }
    
})

app.post("/amount_submit", async(req,res) => {
    try {
        const amount = req.body.amount;
        const phno = req.body.phno;
        const pass = req.body.pass;
        const radio_button = req.body.radio_button;
        const history = req.body.comment + " - " + amount + "Rs";
        const user_info = await db.collection('users').findOne({phno:phno});
        const payment_info = await db.collection('payments').findOne({radio:radio_button});
        const updated_amt= Number(payment_info.Amount) + Number(amount);
        const updated_history = user_info.history + "    " + history;
        console.log(history);
        if (user_info.psw == pass) {
            if(amount <= user_info.balance){
                const updated_bal = user_info.balance - amount;
                //console.log(updated_bal);
                db.collection('users').updateOne({phno},{
                $set : {
                    balance : updated_bal
                }
                })
                res.sendFile(__dirname + "/public/" + "signin.html" );
            }else{
                res.send("Insufficient balance!")
            }
            //user_info.balance = user_info.balance - amount;
            //res.send("Payment successful!");

        } else {
            res.send("Invalid password or phone number.");
        }
        // const updated_amt= payment_info.Amount + amount;
        db.collection('payments').updateOne({radio:radio_button},{
            $set : {
                Amount : updated_amt
            }
        })

        db.collection('users').updateOne({phno},{
            $set : {
                history : updated_history
            }
        })


    } catch (error) {
        //res.send("Invalid password or phone number.");
        throw error;
        
    }
})

app.get("/", function (req,res){
        //res.send("Hello");
        res.sendFile(__dirname + "/public/" + "signin.html" );
    
}).listen(3000);
console.log("Listening on port numner 3000...");
//console.log(__dirname);