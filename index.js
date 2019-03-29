const { NlpManager } = require('node-nlp');
const axios=require('axios');
const {parse, stringify} = require('flatted/cjs');

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
 

	console.log(`${JSON.stringify(res.data,undefined,2)}`);
	
	// Train and save the model.
	(async() => {
    		await manager.train();
    		manager.save();
    		const response = await manager.process('en', res.query.q);
    		res.send(response);
	})().catch((error)=>{
  			console.log(error);
		});   
});


app.listen(port,()=>{
  console.log(`server is started at Port ${port}`)
})
