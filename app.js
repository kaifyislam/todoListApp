//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://kaifyIslam:test123@cluster0.fkvkf.mongodb.net/todoListDB", {useNewUrlParser : true});

const itemsSchema = {
  name : String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name : "Wash your face"
})
const item2 = new Item({
  name : "Brush Your Teeth"
})
const item3 = new Item({
  name : "Eat Breakfast"
})

const defaultItems = [item1,item2,item3];

const listSchema = ({
  name : String,
  items : [itemsSchema]
})

const List = mongoose.model("List",listSchema);


app.get("/", function(req, res) {
 
  Item.find({}).then((items)=>{

      if(items.length === 0){
        Item.insertMany(defaultItems).then(
          console.log("Default items inserted Properly...")
        )
        res.redirect("/")
      }
      else{
        const day = date.getDate();
        res.render("list", {listTitle: "Today", newListItems: items });
      }
    
    
  })


  

});

app.get("/:customListName", (req,res)=>{
   const customListName = _.capitalize(req.params.customListName);

   List.findOne({name : customListName}).then((foundList)=>{
    if(!foundList){
      const list = new List({
        name : customListName,
        items : defaultItems
      })
      list.save();
      res.redirect("/"+customListName)
    }
    else{
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items } )
  }
   })
    
   
})


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name : itemName
  })
  if(listName === "Today"){
    newItem.save()
    res.redirect("/")
  }
  else{
    List.findOne({name : listName}).then((foundList)=>{
      foundList.items.push(newItem);
      foundList.save()
      res.redirect("/"+listName)
    }
    )
  }

  
});
app.post("/delete",(req,res)=>{
  const checkedBoxId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedBoxId).then(
      console.log("Item Deleted Successfully")
    )
    res.redirect("/")
  }
  else{
    List.findOneAndUpdate({name : listName}, {$pull:{items:{_id:checkedBoxId}}}).then(
      res.redirect("/"+listName)
    )
  }




})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
