const Materiel = require("../models/Materiel");

async function addMateriel(req, res) {

  try {
    const { title, description, nameUser, prix, dispo } = req.body
    // Create user in our database
    var mat = await Materiel.create({
      title,
      description,
      dispo,
      nameUser,
      Prix: prix
    });

    res.status(200).json({ message: "ajout avec succeés", mat });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message })
  }
};



async function UpdateMateriel(req, res) {
try{
  
  const { title, description, nameUser, prix, dispo } = req.body
  const {id} = req.params;
  var materiel = await Materiel.findById(id);
  if(!materiel){
    throw new Error("materiel not found!")
  }
  const materialToUpdate = {
    Prix: prix,
    title: title,
    nameUser: nameUser,
    description: description,
    dispo: dispo
  }

  await Materiel.findByIdAndUpdate(id, materialToUpdate);

  res.status(200).json({ message: "update avec succeés", materialToUpdate});


}catch(err){
  res.status(500).json({message: err.message})
}

}


async function deleteMateriel(req, res) {
  try {
    var id = req.params.id;
    var materiel = await Materiel.findOne({ _id: id })
    if (!materiel)
      throw new Error("materiel not found!")
    await Materiel.findByIdAndDelete(id);
    res.status(200).json("materiel removed successfully!")
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


async function GetMateriel(req, res) {
  try {
    var id = req.params.id;

    var materiel = await Materiel.findOne({ _id: id })
    if (materiel) {
      res.status(200).json(materiel)
    }
    else
      res.status(404).json("materiel not found")
  } catch (error) {
    console.log(error);
  }
}


async function GetALLMateriel(req, res) {
  try {
    var materiel = await Materiel.find({})
    if (materiel) {
      res.status(200).json(materiel)
    } else
      res.status(404).json("pack not found")
  } catch (error) {
    console.log(error);
  }
}






module.exports = {
  addMateriel,
  UpdateMateriel,
  deleteMateriel,
  GetMateriel,
  GetALLMateriel
}
/* export async function GetMaterielbyUser(req,res){
   
   
   try {
 
     var a =req.body.nameUser; 
     var materiel = await Materiel.find({ nameUser:a})
     if(materiel)
     {
       res.send(materiel)
       res.status(200).json(materiel)
     }else
     res.status(404).json("pack not found")
   } catch (error) {
     console.log(error);
   }
 
 }*/