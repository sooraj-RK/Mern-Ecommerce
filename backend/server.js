import Express from 'express';
import data from './data.js';

const app = Express();

app.get('/api/products' , (req,res)=>{
    res.send(data.products)
});

const port = process.env.PORT  || 5000;
 
app.listen(port,()=>{
    console.log(`server started at http://localhost:${port}`);
});