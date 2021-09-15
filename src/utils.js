

exports.log = (msg, obj=false) => {
    if(obj) console.log("DEBUG: "+msg, obj);
    else console.log("DEBUG: "+msg);
    
}