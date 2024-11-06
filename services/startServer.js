// This file only provides the function to start and listen the app for a given port number

const startServer = async(port)=>
    app.listen(port, ()=>{
        console.log(`The server is currently running on port ${port}`);
});

exports.startServer  =      startServer;
