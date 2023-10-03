//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlenco// import express from "express";
// import axios from "axios";
// import bodyParser from "body-parser";
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser')


const app = express();
const port = 3000;
const API_URL = "https://api.tvmaze.com/singlesearch/shows?q="
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}))


app.get("/", async(req,res)=>{
    // const search = req.body;
   
    try{
       const result = await axios.get(API_URL+"girls");
       const response = await axios.get("https://api.tvmaze.com/shows/1/episodes");
       const response2 = await axios.get("https://api.tvmaze.com/shows/1/cast");
       const episodeData = response.data.map((episode) => ({
        season: JSON.parse(episode.season),
        number: JSON.parse(episode.number),
        name: JSON.parse(JSON.stringify(episode.name)),
        mediumImage: JSON.parse(JSON.stringify(episode.image.original)),
        summary : episode.summary.replace(/<p>/g, "").replace(/<\/p>/g, ""),
        rating : JSON.parse(episode.rating.average)
      }));
      const castData = response2.data.map((cast) => ({
         image : JSON.parse(JSON.stringify(cast.person.image.medium)),
         name : JSON.parse(JSON.stringify(cast.person.name))
      }));
       res.render("index.ejs", {data : JSON.parse(JSON.stringify(result.data.name)), data2 : JSON.parse(JSON.stringify(result.data.language)),
       data3 : JSON.parse(JSON.stringify(result.data.genres)),
       data4 : JSON.parse(JSON.stringify(result.data.image.original)),
       data5 : result.data.summary.replace(/<p>/g, "").replace(/<\/p>/g, "").replace(/<b>|<\/b>/g, ""),
       data6 : JSON.parse(result.data.rating.average),
       
       episodeData: episodeData,
       castData : castData
       
       
    });
       
    }
    catch(error){
        res.status(404).send(error.message);
    }
})
app.post("/", async(req,res)=>{
    const show = req.body.search;
    try{
        const result = await axios.get(API_URL+show);
        const id = JSON.parse(result.data.id);
        const response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
        const response2 = await axios.get(`https://api.tvmaze.com/shows/${id}/cast`);
        
        const episodeData = response.data.map((episode) => ({
            season: JSON.parse(episode.season),
            number: JSON.parse(episode.number),
            name: JSON.parse(JSON.stringify(episode.name)),
            mediumImage: JSON.parse(JSON.stringify(episode.image.original)),
            summary : episode.summary.replace(/<p>/g, "").replace(/<\/p>/g, ""),
            rating : JSON.parse(episode.rating.average)
          }));
          const castData = response2.data.map((cast) => ({
            image : JSON.parse(JSON.stringify(cast.person.image.medium)),
            name : JSON.parse(JSON.stringify(cast.person.name))
         }));
        
        res.render("index.ejs", 
        {data : JSON.parse(JSON.stringify(result.data.name)),
         data2 : JSON.parse(JSON.stringify(result.data.language)),
         data3 : JSON.parse(JSON.stringify(result.data.genres)),
         data4 : JSON.parse(JSON.stringify(result.data.image.medium)),
         data5 : result.data.summary.replace(/<p>/g, "").replace(/<\/p>/g, "").replace(/<b>|<\/b>/g, ""),
         data6 : JSON.parse(result.data.rating.average),
         
         episodeData: episodeData,
         castData : castData
         

        })
        
     }
     catch(error){
         res.status(404).send(error.message);
     }

})



app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
ded({extended: true}));
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
