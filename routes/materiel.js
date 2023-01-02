var express = require('express');
var router = express.Router();
const {GetMateriel,deleteMateriel,UpdateMateriel,addMateriel, GetALLMateriel} = require("../controllers/materielController");

router.post('/add',addMateriel);
router.post('/update/:id',UpdateMateriel);
router.delete('/delete/:id',deleteMateriel);
router.get('/:id',GetMateriel);
router.get('/',GetALLMateriel)

module.exports = router;