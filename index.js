const { NlpManager } = require('node-nlp');
const axios=require('axios');

var express=require('express');
const app = express();

var port=process.env.PORT || 3000; 

// Adds the utterances and intents for the NLP


app.get('/', (req, res) =>{

	var manager = new NlpManager({ languages: ['en'] });
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
 
	// Train and save the model.
	(async() => {
    		await manager.train();
    		manager.save();
    		const response = await manager.process('en', JSON.stringify(req.q,undefined,2));
    		res.send(response);
	})();   
});


app.listen(port,()=>{
  console.log(`server is started at Port ${port}`)
})
