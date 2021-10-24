const router = require("express").Router();

router.get("/", (req,res)=>{
    res.send('Auth Routed')
})


module.exports = router