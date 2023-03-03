// jshint :esverion6

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const randomString = require('randomstring');
const { promisify } = require("util");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
PORT = 3000;

const domain = "127.0.0.1:3000";

let conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_urlarsenal"
});
conn.connect(function(err) {
  if (err) throw err;
});

const mysqlQuery = promisify(conn.query).bind(conn);

function insertData(longURL,  shortURL){
  var sql = "INSERT INTO arsenal (longurl, shorturl) VALUES (?, ?)";
  var inserts = [longURL, shortURL];
  sql = mysql.format(sql, inserts);
  conn.query(sql, function (err, _) {
    if (err) throw err;
  });
}


async function genRandomText(){
  const randomShortUrlString = randomString.generate(7);
  let sqlStatement = `SELECT shorturl from arsenal where shorturl="${randomShortUrlString}"`;
  sqlStatement = mysql.format(sqlStatement);

  try {
    const result = await mysqlQuery(sqlStatement);
    
    const sqlArray = JSON.parse(JSON.stringify(result));
    if(sqlArray.length > 0) {
      return genRandomText();
    }

  } catch(err) {
    return genRandomText();
  }

  return randomShortUrlString;
}


// STATUS CODE FOR THIS WEB APP TO SANITIZE CODE ERRORS
// 600 -> Error
// 700 -> Success


app.get("/", (req, res)=>{
  res.redirect("/app");
})


app.get("/app", (req, res)=>{

  res.render("index", {
    initURL: '',
    shortURL: '',
    copyBtnActive: '',
  });

});

app.get("/about-us", (req, res)=>{
  res.render("about");
});

app.post("/app", async(req, res)=>{
  let url = req.body.longUrl;

  if(!url || url === '') {
    res.redirect("/app");
    return;
  } else if(url.includes(domain)) {
    res.redirect("https://sudhanshu.io/");
    return;
  }

  if(!url.startsWith('http') && !url.startsWith('https')){
    url = `http://${url}/`;
  }

  const randomUrlText = await genRandomText();
  insertData(url, randomUrlText);
  const shortUrl = `http://${domain}/${randomUrlText}`;
  
  res.render("index", {
      initURL: url, 
      shortURL: shortUrl,
      copyBtnActive: 'active',
  });
});

app.get("/:url", async(req, res)=>{
  const shortUrl = req.params.url;

  if(!shortUrl || shortUrl === 'favicon.ico' || shortUrl === '') {
    res.redirect("/app");
    return;
  }
  else if(shortUrl.length < 7){
    res.send("<h1 style='text-align: center'>Are you Lost...!</h1>");
    return;
  }
  else if(shortUrl.length > 7){
    res.send("<h1 style='text-align: center'>Are you Lost...!</h1>");
    return;
  }

  try {
    const result = await mysqlQuery(`SELECT longurl FROM arsenal WHERE shorturl = "${shortUrl}"`);
    const sqlArray = JSON.parse(JSON.stringify(result));

    if(sqlArray.length <= 0) {
        res.redirect("/app");
        return;
    }

    res.redirect(sqlArray[0].longurl);

  } catch(err) {
    console.log(err);
  }
});

app.get("*", (req, res)=>{
  res.send("<h1 style='text-align: center'>Are you Lost...!</h1>")
});


app.listen(PORT, ()=>{
  console.log(`visit: http://${domain}/`);
});
