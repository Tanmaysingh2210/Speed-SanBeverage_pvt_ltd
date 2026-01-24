export const logout  = async (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).json({message: 'Error logging out'});
        console.log("session: ",req.session);
        console.log( "session id : ",req.sessionID);
        res.status(200).json({message: 'Logged Out Sucessfully'});
    });
}