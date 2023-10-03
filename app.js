// import express from "express";
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
