const { NlpManager } = require('node-nlp');
const axios=require('axios');
const {parse, stringify} = require('flatted/cjs');
//const intent=require('./intent.js');
//const answers=require('./answers.js');
var fs = require('fs');


var express=require('express');
const app = express();

var port=process.env.PORT || 3000; 

// Adds the utterances and intents for the NLP


const manager = new NlpManager({ languages: ['en'] });
	manager.addDocument('en', 'goodbye for now', 'greetings.bye');
	manager.addDocument('en', 'bye bye take care', 'greetings.bye');
	manager.addDocument('en', 'okay see you later', 'greetings.bye');
	manager.addDocument('en', 'bye for now', 'greetings.bye');
	manager.addDocument('en', 'i must go', 'greetings.bye');
	manager.addDocument('en', 'hello', 'greetings.hello');
	manager.addDocument('en', 'hi', 'greetings.hello');
	manager.addDocument('en', 'howdy', 'greetings.hello');
 
	// Train also the NLG
	manager.addAnswer('en', 'greetings.bye', 'Till next time');
	manager.addAnswer('en', 'greetings.bye', 'see you soon!');
	manager.addAnswer('en', 'greetings.hello', 'Hey there!');
	manager.addAnswer('en', 'greetings.hello', 'Greetings!');
 

app.get('/', (req, res) =>{
 

	console.log(`${stringify(req,undefined,2)}`);
	var temp;

	// Train and save the model.
	(async() => {
		if(req.query.q && req.query.t)
                {
                    console.log(`Training`);
		    manager.addDocument('en', `${req.query.q}`, `${req.query.t}`);
                    temp={
			query : req.query.q,
 			intent : req.query.t
                    };   
		    //fs.appendFileSync("intent.js",`${JSON.stringify(temp,undefined,2)}`+"\n");
		    fs.appendFile('intent.js',`${JSON.stringify(temp,undefined,2)}`+"\n", function (err) {
		    	if (err) throw err;
  			console.log('Saved!');
		    });
                    //intent.intents.push(temp);
                }
                if(req.query.t && req.query.a)
		{
			console.log(`Setting Answer`);
			manager.addAnswer('en', `${req.query.t}`, `${req.query.a}`);
			temp={
				intent:`${req.query.t}`,
 				answer:`${req.query.a}`
                        };
			console.log(temp);
			//fs.appendFileSync("answers.js",`${JSON.stringify(temp,undefined,2)}`+"\n");
			fs.appendFile('answers.js',`${JSON.stringify(temp,undefined,2)}`+"\n", function (err) {
		    		if (err) throw err;
  				console.log('Saved!');
		    	});			
			//answers.ans.push(temp);
		}
    		await manager.train();
    		manager.save();
    		const response = await manager.process('en', req.query.q);
    		res.send(response);
	})().catch((error)=>{
  			console.log(error);
		});   
});


app.listen(port,()=>{
  console.log(`server is started at Port ${port}`)
})
